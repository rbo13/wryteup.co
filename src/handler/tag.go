package handler

import (
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	pg "wryteup.co/generated/db"
)

const ErrDuplicateKey = "pq: duplicate key value"

// CreateTag handles creating of tag
// from a POST request.
func (h *Handler) CreateTag(c *fiber.Ctx) error {
	tag := &pg.Tag{}
	if err := c.BodyParser(tag); err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	if tag.Name == "" {
		return c.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{
			"success": false,
			"message": "Tag name is required",
			"data":    nil,
		})
	}

	createdTag, err := h.db.CreateTag(c.Context(), pg.CreateTagParams{
		ID:        uuid.New(),
		Name:      strings.ToLower(tag.Name),
		CreatedAt: time.Now(),
	})

	if err != nil {
		errMsg := "Tag name already exists"
		if !strings.ContainsAny(err.Error(), ErrDuplicateKey) {
			errMsg = err.Error()
		}

		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": errMsg,
			"data":    nil,
		})
	}

	return c.Status(http.StatusCreated).JSON(&fiber.Map{
		"success": true,
		"message": "Tag created successfully",
		"data":    createdTag,
	})
}
