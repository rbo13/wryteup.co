package handler

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// BootstrapData handles the
// bootstrapping of user information
// from a given token inside the Auth header
// or cookie session.
func (h *Handler) BootstrapData(c *fiber.Ctx) error {
	headerToken := getTokenFromRequest(c)
	if headerToken == "" {
		return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"success": false,
			"message": "Token is missing",
			"data":    nil,
		})
	}
	claims, ok := extractClaims(headerToken)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"success": false,
			"message": "Token is missing",
			"data":    nil,
		})
	}

	accountId, asserted := claims["account_id"].(string)
	if !asserted {
		return c.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{
			"success": false,
			"message": "Cannot assert current value",
			"data":    nil,
		})
	}

	accountUUID, err := uuid.Parse(accountId)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}
	userAndAccountInfo, err := h.db.GetUserAndAccountInfo(c.Context(), accountUUID)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	return c.Status(http.StatusOK).JSON(&fiber.Map{
		"success": true,
		"message": "Success",
		"data":    userAndAccountInfo,
	})
}
