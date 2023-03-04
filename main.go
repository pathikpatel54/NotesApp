package main

import (
	"log"
	"notes-app/database"
	"notes-app/routes"

	"github.com/gin-gonic/gin"
)

func init() {
	log.SetFlags(log.Lshortfile | log.LstdFlags)
}

func main() {

	r := gin.New()
	db, ctx := database.GetMongoDB()

	authRoutes := routes.NewAuthController(db, ctx)
	noteRoutes := routes.NewNoteController(db, ctx)

	r.GET("/auth/google", authRoutes.Login)
	r.GET("/auth/google/callback", authRoutes.Callback)
	r.GET("/api/user", authRoutes.User)
	r.GET("/api/logout", authRoutes.Logout)

	r.GET("/api/notes", noteRoutes.NotesIndex)
	r.POST("/api/note", noteRoutes.NewNote)
	r.GET("/api/notes/socket", noteRoutes.NoteWebsocket)

	r.Run()
}
