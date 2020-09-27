package handler

// Handler holds the dependency
// of our different HTTP handler object.
type Handler struct {
}

func New() *Handler {
	return &Handler{}
}
