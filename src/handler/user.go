package handler

import "github.com/gofiber/fiber/v2"

// UserList handles the get all users route.
func (h *Handler) UserList(c *fiber.Ctx) error {
	return c.Send([]byte("Get all lists"))
}
