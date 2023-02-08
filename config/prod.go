package config

import "os"

var prod = key{
	GoogleClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
	GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
	MongoDB:            os.Getenv("MONGO_KEY"),
}
