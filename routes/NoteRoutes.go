package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"notes-app/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lesismal/nbio/nbhttp/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type NoteController struct {
	db  *mongo.Database
	ctx context.Context
}

func NewNoteController(db *mongo.Database, ctx context.Context) NoteController {
	return NoteController{db, ctx}
}

func (nc *NoteController) NotesIndex(c *gin.Context) {
	logged, user := isLoggedIn(c, nc.db, nc.ctx)

	if !logged {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	var notes []models.Note

	cursor, err := nc.db.Collection("notes").Find(nc.ctx, bson.D{{Key: "author", Value: user.GoogleID}})

	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, "")
		return
	}

	for cursor.Next(nc.ctx) {
		var note models.Note

		err := cursor.Decode(&note)

		if err != nil {
			log.Println(err.Error())
			c.JSON(http.StatusInternalServerError, "")
			return
		}

		notes = append(notes, note)
	}

	c.JSON(http.StatusOK, notes)
}

func newUpgrader(user *models.User, nc *NoteController) *websocket.Upgrader {
	u := websocket.NewUpgrader()

	u.OnMessage(func(c *websocket.Conn, messageType websocket.MessageType, data []byte) {
		var message models.Message

		json.Unmarshal(data, &message)

		result, _ := nc.db.Collection("notes").UpdateOne(nc.ctx, bson.D{{Key: "_id", Value: message.New.ID}, {Key: "author", Value: user.GoogleID}}, bson.D{{Key: "$set", Value: message.New}})

		c.WriteMessage(messageType, []byte(strconv.Itoa(int(result.ModifiedCount))))
	})

	u.OnClose(func(c *websocket.Conn, err error) {
		fmt.Println("OnClose:", c.RemoteAddr().String(), err)
	})
	return u
}

func (nc *NoteController) NoteWebsocket(c *gin.Context) {
	logged, user := isLoggedIn(c, nc.db, nc.ctx)

	if !logged {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	upgrader := newUpgrader(user, nc)
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		panic(err)
	}
	wsConn := conn.(*websocket.Conn)
	wsConn.SetReadDeadline(time.Time{})

	fmt.Println("OnOpen:", wsConn.RemoteAddr().String())
}
