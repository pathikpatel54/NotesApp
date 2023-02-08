package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Note struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id,omitempty" `
	DateCreated time.Time          `json:"date-created" bson:"date-created"`
	Content     string             `json:"content" bson:"content"`
	Author      string             `json:"author" bson:"author"`
	Folder      string             `json:"folder" bson:"folder"`
	Category    string             `json:"category" bson:"category"`
}
