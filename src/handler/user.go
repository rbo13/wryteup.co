package handler

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

// UserList handles the get all users route.
func (h *Handler) UserList(c *fiber.Ctx) error {
	users, err := h.db.GetUsers(c.Context())
	if err != nil {
		return err
	}

	return c.Status(http.StatusOK).JSON(&fiber.Map{
		"success": true,
		"data":    users,
	})
}
