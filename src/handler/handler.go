package handler

import pg "wryteup.co/generated/db"

// Handler holds the dependency
// of our different HTTP handler object.
type Handler struct {
	db *pg.Queries
}

func New(db *pg.Queries) *Handler {
	return &Handler{
		db,
	}
}
