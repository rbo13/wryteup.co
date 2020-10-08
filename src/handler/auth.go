package handler

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	pg "wryteup.co/generated/db"
)

const SALT_ROUNDS = bcrypt.DefaultCost
const ErrNoResultSet = "sql: no rows in result set"

// Login handles the login request.
func (h *Handler) Login(c *fiber.Ctx) error {
	account := &pg.Account{}

	if err := c.BodyParser(account); err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	accountInfo, err := h.db.Login(c.Context(), account.EmailAddress)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(&fiber.Map{
			"success": false,
			"message": "Email Address or Password is incorrect",
			"data":    nil,
		})
	}

	passwordsEqual := comparePasswords(account.Password, accountInfo.Password)
	if !passwordsEqual {
		return c.Status(http.StatusNotFound).JSON(&fiber.Map{
			"success": false,
			"message": "Email Address or Password is incorrect",
			"data":    nil,
		})
	}

	// create JWT token
	jwtToken := jwt.New(jwt.SigningMethodHS256)
	claims := jwtToken.Claims.(jwt.MapClaims)
	claims["account_id"] = accountInfo.ID
	claims["authenticated"] = true
	claims["exp"] = time.Now().Add(1 * time.Hour).Unix()

	t, err := jwtToken.SignedString([]byte(os.Getenv("JWT_SIGNINGKEY")))
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": "Invalid Signing Key",
			"data":    nil,
		})
	}

	currentUser, err := h.db.GetUserByAccount(c.Context(), accountInfo.ID)
	if err != nil {
		if err.Error() != ErrNoResultSet {
			return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}
	}

	// set cookie
	cookie := new(fiber.Cookie)
	cookie.Name = "authToken"
	cookie.Value = t
	cookie.Expires = time.Now().Add(1 * time.Hour)

	c.Cookie(cookie)

	return c.Status(http.StatusOK).JSON(&fiber.Map{
		"success": true,
		"message": "Logged in successfully",
		"data": map[string]interface{}{
			"token":      t,
			"account_id": accountInfo.ID,
			"user":       currentUser,
		},
	})
}

func (h *Handler) Logout(c *fiber.Ctx) error {
	expireAt := time.Unix(0, 0)

	cookie := new(fiber.Cookie)
	cookie.Name = "authToken"
	cookie.Value = ""
	cookie.Expires = expireAt

	c.Cookie(cookie)
	return c.Status(http.StatusOK).JSON(&fiber.Map{
		"success": true,
		"message": "Logged-out successfully",
	})
}

// Signup handles the signup request.
func (h *Handler) Signup(c *fiber.Ctx) error {
	account := &pg.Account{}
	if err := c.BodyParser(account); err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	if account.EmailAddress == "" && account.Password == "" {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": "Email Address and Password is required",
			"data":    nil,
		})
	}

	hashedPassword, err := hashPassword(account.Password)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
	}

	createdAccount, err := h.db.Signup(c.Context(), pg.SignupParams{
		ID:           uuid.New(),
		EmailAddress: account.EmailAddress,
		Password:     hashedPassword,
		Token:        "",
		CreatedAt:    time.Now(),
	})

	if err != nil {
		signUpErr := "Email is already taken"
		if !strings.ContainsAny(err.Error(), signUpErr) {
			signUpErr = err.Error()
		}
		return c.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"success": false,
			"message": signUpErr,
			"data":    nil,
		})
	}

	return c.Status(http.StatusOK).JSON(&fiber.Map{
		"success": true,
		"message": "Account created successfully!",
		"data":    createdAccount,
	})
}

func hashPassword(rawPassword string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(rawPassword), SALT_ROUNDS)
	return string(bytes), err
}

func comparePasswords(raw, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(raw))
	return err == nil
}
