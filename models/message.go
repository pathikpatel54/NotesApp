package models

type Message struct {
	Type string `json:"type"`
	New  Note   `json:"new"`
}
