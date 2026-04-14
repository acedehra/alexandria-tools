# Docker Deployment Guide

Alexandria Tools can be easily deployed using Docker. The application is a frontend-only SvelteKit app that serves static files.

## Quick Start

Using Docker Compose (recommended):

```bash
docker-compose up -d
```

The application will be available at `http://localhost:8080`

Using Docker directly:

```bash
docker build -t alexandria-tools .
docker run -p 8080:80 alexandria-tools
```

## Configuration

### Changing the Port

Edit `docker-compose.yml` and modify the ports mapping:

```yaml
ports:
  - "YOUR_PORT:80"
```

Or use Docker CLI:

```bash
docker run -p YOUR_PORT:80 alexandria-tools
```

### Environment Variables

This is a frontend-only application, so no environment variables are required. All configuration is built into the static files during the build process.

### Building for Production

The Dockerfile automatically:

1. Installs the `@sveltejs/adapter-static` adapter
2. Builds the application as static files
3. Uses nginx (Alpine) to serve the files efficiently
4. Enables gzip compression
5. Sets up proper caching headers
6. Configures SPA routing

## Dockerfile Details

- **Build Stage**: Uses Node.js 22 Alpine to build the SvelteKit application with static adapter
- **Runtime Stage**: Uses nginx Alpine (minimal ~10MB) to serve static files
- **Total Size**: ~30-50MB final image

## Maintenance

### View Logs

```bash
docker-compose logs -f
```

### Stop the Container

```bash
docker-compose down
```

### Update the Application

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Rebuild Without Cache

```bash
docker build --no-cache -t alexandria-tools .
```

## Health Check

The container includes a health check that verifies the web server is responding. You can check the health status with:

```bash
docker ps
```

## Performance Tips

1. **CDN**: Consider using a CDN in front of the nginx server for global distribution
2. **Caching**: Static assets are cached for 1 year with immutable headers
3. **Compression**: Gzip compression is enabled for text-based assets
4. **SSL**: Use a reverse proxy like Caddy or Traefik for SSL termination

## Troubleshooting

### Container won't start

Check the logs:

```bash
docker logs alexandria-tools
```

### Can't access the application

1. Verify the container is running: `docker ps`
2. Check if the port is available: `netstat -tuln | grep 8080`
3. Test locally: `curl http://localhost:8080`
