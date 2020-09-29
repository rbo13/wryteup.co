package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	pg "wryteup.co/generated/db"
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

func (h *Handler) Create(c *fiber.Ctx) error {
	user := &pg.User{}

	if err := c.BodyParser(user); err != nil {
		fmt.Println(user.BirthDate)
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	bdate, err := time.Parse(time.RFC3339, user.BirthDate.String())
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	createdUser, err := h.db.CreateUser(c.Context(), pg.CreateUserParams{
		ID:        uuid.New(),
		FirstName: user.FirstName,
		LastName:  user.LastName,
		BirthDate: bdate,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	})

	if err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}
	return c.Status(http.StatusCreated).JSON(&fiber.Map{
		"success": true,
		"message": "User has been created successfully!",
		"data":    createdUser,
	})
}
