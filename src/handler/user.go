package handler

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	pg "wryteup.co/generated/db"
)

const (
	layoutISO = "2006-01-02"
	tokenLen  = 2
)

// CreateUserPayload represents the form when
// creating a new user
type CreateUserPayload struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	BirthDate string `json:"birth_date"`
}

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
	user := &CreateUserPayload{}

	if err := c.BodyParser(user); err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	bdate, err := time.Parse(layoutISO, user.BirthDate)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	// get the token from header
	headerToken := getTokenFromRequest(c)
	if headerToken == "" {
		return c.Status(http.StatusUnauthorized).JSON(&fiber.Map{
			"success": false,
			"message": "Token is missing",
			"data":    nil,
		})
	}

	// extract the claims of header
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

	createdUser, err := h.db.CreateUser(c.Context(), pg.CreateUserParams{
		ID:        uuid.New(),
		AccountID: accountUUID,
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

func extractClaims(tokenStr string) (jwt.MapClaims, bool) {
	hmacSecret := []byte(os.Getenv("JWT_SIGNINGKEY"))
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return hmacSecret, nil
	})

	if err != nil {
		return nil, false
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, true
	}

	return nil, false
}

func getTokenFromRequest(c *fiber.Ctx) string {
	reqToken := c.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer")
	if len(splitToken) != tokenLen {
		return ""
	}
	return strings.TrimSpace(splitToken[1])
}
