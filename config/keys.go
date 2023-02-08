package config

import (
	"os"
)

type key struct {
	GoogleClientID     string
	GoogleClientSecret string
	MongoDB            string
}

var Keys = func() key {
	if os.Getenv("GO_ENV") == "production" {
		return prod
	} else {
		return dev
	}
}()
