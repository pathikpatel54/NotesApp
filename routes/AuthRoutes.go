package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"notes-app/config"
	"notes-app/models"
	"notes-app/utils"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthController struct {
	db  *mongo.Database
	ctx context.Context
}

func NewAuthController(db *mongo.Database, ctx context.Context) AuthController {
	return AuthController{
		db,
		ctx,
	}
}

var (
	googleOauthConfig *oauth2.Config
	oauthstate        string
)

func init() {
	var err error

	googleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:8080/auth/google/callback",
		ClientID:     config.Keys.GoogleClientID,
		ClientSecret: config.Keys.GoogleClientSecret,
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}

	oauthstate, err = utils.GenerateRandomString(20)

	if err != nil {
		log.Println(err.Error())
	}
}

func (ac *AuthController) Login(c *gin.Context) {
	c.Redirect(http.StatusTemporaryRedirect, googleOauthConfig.AuthCodeURL(oauthstate))
}

func (ac *AuthController) Callback(c *gin.Context) {

	request := c.Request

	user, err := getUserInfo(request.FormValue("state"), request.FormValue("code"))

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	generateSession(user, c, ac)
	c.Redirect(http.StatusSeeOther, "/")
}

func (ac *AuthController) User(c *gin.Context) {
	logged, user := isLoggedIn(c, ac.db, ac.ctx)

	if !logged {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	c.JSON(http.StatusOK, user)
}

func (ac *AuthController) Logout(c *gin.Context) {
	logged, user := isLoggedIn(c, ac.db, ac.ctx)

	if !logged {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	_, err := ac.db.Collection("sessions").DeleteMany(ac.ctx, bson.D{{Key: "email", Value: user.Email}})

	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, "")
		return
	}

	c.SetCookie("session", "", -1, "/", "localhost", false, true)
	c.Redirect(http.StatusSeeOther, "/")
}

func getUserInfo(state string, code string) (*models.User, error) {
	var user models.User

	if state != oauthstate {
		log.Println(oauthstate)
		return &models.User{}, fmt.Errorf("oauth state does not match")
	}

	token, err := googleOauthConfig.Exchange(context.TODO(), code)

	if err != nil {
		return &models.User{}, fmt.Errorf("coud not generate token")
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)

	if err != nil {
		return &models.User{}, fmt.Errorf("request to get user details failed")
	}

	defer response.Body.Close()

	err = json.NewDecoder(response.Body).Decode(&user)

	if err != nil {
		return &models.User{}, fmt.Errorf("failed reading response body: %s", err.Error())
	}

	return &user, nil
}

func generateSession(user *models.User, c *gin.Context, ac *AuthController) {
	sessionID, _ := utils.GenerateRandomString(20)

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("session", sessionID, (30 * 24 * 60 * 60), "/", "localhost", false, true)

	_, err := ac.db.Collection("users").UpdateOne(ac.ctx, bson.D{{Key: "id", Value: user.GoogleID}}, bson.D{{Key: "$set", Value: user}}, options.Update().SetUpsert(true))

	if err != nil {
		log.Println(err.Error())
	}

	_, err = ac.db.Collection("sessions").UpdateOne(ac.ctx, bson.D{{Key: "email", Value: user.Email}}, bson.M{
		"$set": bson.M{
			"session-id": sessionID,
			"expires":    time.Now().Add(time.Second * 24 * 60 * 60),
		},
	}, options.Update().SetUpsert(true))

	if err != nil {
		log.Println(err.Error())
	}
}

func isLoggedIn(c *gin.Context, db *mongo.Database, ctx context.Context) (bool, *models.User) {
	var session models.Session
	var user models.User

	cookie, err := c.Cookie("session")

	if err != nil {
		log.Println(err.Error())
		return false, &models.User{}
	}

	err = db.Collection("sessions").FindOne(ctx, bson.D{{Key: "session-id", Value: cookie}}).Decode(&session)

	if err != nil {
		log.Println(err.Error())
		return false, &models.User{}
	}

	if session.Expires.Before(time.Now()) {
		c.SetCookie("session", "", -1, "/", "localhost", false, true)
		db.Collection("sessions").DeleteMany(ctx, bson.D{{Key: "email", Value: session.Email}})
		return false, &models.User{}
	}

	err = db.Collection("users").FindOne(ctx, bson.D{{Key: "email", Value: session.Email}}).Decode(&user)

	if err != nil {
		log.Println("Error retreiving User")
		return false, &models.User{}
	}

	return true, &user
}
