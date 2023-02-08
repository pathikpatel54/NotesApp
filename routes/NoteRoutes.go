package routes

import (
	"context"
	"log"
	"net/http"
	"notes-app/models"

	"github.com/gin-gonic/gin"
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

func (nc *NoteController) NotePost(c *gin.Context) {
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
