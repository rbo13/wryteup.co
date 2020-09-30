package handler

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
	pg "wryteup.co/generated/db"
)

const defaultLang = "en"

// GetAllPublishedWriteUps returns a slice of Writeups
// if its published.
func (h *Handler) GetAllPublishedWriteups(c *fiber.Ctx) error {
	writeups, err := h.db.GetAllPublishedWriteups(c.Context())
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	return c.Status(http.StatusOK).JSON(&fiber.Map{
		"success": true,
		"message": "Write ups successsfully retrieved",
		"data":    writeups,
	})
}

// GetAllWriteupsFromUser returns a slice of Writeups
// from a give user_id.
func (h *Handler) GetAllWriteupsFromUser(c *fiber.Ctx) error {
	userId := c.Params("user_id")

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	writeups, err := h.db.GetWriteUpFromOwner(c.Context(), userUUID)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    writeups,
		})
	}

	return c.Status(http.StatusOK).JSON(&fiber.Map{
		"success": true,
		"message": "Write ups successfully retrieved",
		"data":    writeups,
	})
}

// CreateWriteUp handles the POST request
// to create a new write up.
func (h *Handler) CreateWriteUp(c *fiber.Ctx) error {
	reqToken := getTokenFromRequest(c)
	if reqToken == "" {
		return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"success": false,
			"message": "Please login to continue",
			"data":    nil,
		})
	}

	claims, ok := extractClaims(reqToken)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"success": false,
			"message": "Please login to continue",
			"data":    nil,
		})
	}

	accountId, asserted := claims["account_id"].(string)
	if !asserted {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": "Please login to continue",
			"data":    nil,
		})
	}

	accountUUID, err := uuid.Parse(accountId)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	user, err := h.db.GetUserByAccount(c.Context(), accountUUID)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	writeup := &pg.WriteUp{}
	if err := c.BodyParser(writeup); err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	idx := strings.Split(user.ID.String(), "-")[1]
	slug_url := fmt.Sprintf("%s-%s", slug.MakeLang(writeup.Title, defaultLang), idx)

	createdWriteup, err := h.db.CreateWriteup(c.Context(), pg.CreateWriteupParams{
		ID:        uuid.New(),
		UserID:    user.ID,
		Title:     writeup.Title,
		Content:   writeup.Content,
		SlugUrl:   slug_url,
		CreatedAt: time.Now(),
	})
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	return c.Status(http.StatusCreated).JSON(&fiber.Map{
		"success": true,
		"message": "Write up successfully created!",
		"data":    createdWriteup,
	})
}
