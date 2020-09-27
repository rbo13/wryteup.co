# Stage 1
FROM golang:stretch AS build
RUN mkdir -p /go/src/app
WORKDIR /go/src/app
RUN apt-get update && \
	apt-get install -y xz-utils
ADD https://github.com/upx/upx/releases/download/v3.96/upx-3.96-amd64_linux.tar.xz /usr/local
RUN xz -d -c /usr/local/upx-3.96-amd64_linux.tar.xz | \
    tar -xOf - upx-3.96-amd64_linux/upx > /bin/upx && \
    chmod a+x /bin/upx
ENV GO111MODULE=on
COPY . .
RUN go mod tidy
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -installsuffix -a -tags netgo -ldflags="-w -s -extldflags" -o app main.go && \
    upx app

FROM scratch
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /go/src/app/app /app
WORKDIR /
CMD ["./app"]