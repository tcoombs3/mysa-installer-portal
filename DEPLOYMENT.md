# Deployment Guide

This guide explains how to deploy the Ticket Management System to DigitalOcean.

## Prerequisites

1. A DigitalOcean account
2. Docker installed on your local machine
3. DigitalOcean CLI (doctl) installed
4. GitHub account

## Deployment Steps

### 1. Prepare the Application

1. Build the React frontend:
```bash
cd client
npm install
npm run build
```

2. Test the Docker build locally:
```bash
docker-compose up --build
```

### 2. Set Up DigitalOcean

1. Create a new DigitalOcean Droplet:
   - Choose Docker from the Marketplace
   - Select a plan (Basic is fine for starting)
   - Choose a datacenter region close to your users
   - Add your SSH key
   - Choose a hostname

2. Configure DNS (Optional):
   - Add an A record pointing to your Droplet's IP
   - Wait for DNS propagation

### 3. Deploy to DigitalOcean

1. SSH into your Droplet:
```bash
ssh root@your-droplet-ip
```

2. Clone the repository:
```bash
git clone https://github.com/your-username/ticket-management-system.git
cd ticket-management-system
```

3. Create environment file:
```bash
cp server/.env.example server/.env
# Edit .env with your production values
nano server/.env
```

4. Build and run with Docker Compose:
```bash
docker-compose up -d --build
```

### 4. Set Up Continuous Deployment (Optional)

1. Create GitHub Actions workflow:
   - Add GitHub Secrets for DigitalOcean API token
   - Configure automatic deployments on main branch pushes

2. Set up GitHub Actions variables:
   - DIGITALOCEAN_ACCESS_TOKEN
   - DOCKER_USERNAME
   - DOCKER_PASSWORD

### 5. SSL Configuration (Recommended)

1. Install Certbot:
```bash
apt-get update
apt-get install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
certbot --nginx -d yourdomain.com
```

## Monitoring and Maintenance

1. View logs:
```bash
docker-compose logs -f
```

2. Monitor resources:
```bash
docker stats
```

3. Update application:
```bash
git pull
docker-compose up -d --build
```

## Backup

1. Database backups (AirTable handles this)
2. Environment variables:
```bash
cp server/.env server/.env.backup
```

## Troubleshooting

1. Check application logs:
```bash
docker-compose logs server
```

2. Verify container status:
```bash
docker-compose ps
```

3. Restart services:
```bash
docker-compose restart
```

## Security Considerations

1. Keep Docker and all dependencies updated
2. Use strong passwords and API keys
3. Regularly update SSL certificates
4. Monitor system resources and logs
5. Set up firewall rules (UFW)
6. Enable automatic security updates

## Scaling

To scale the application:

1. Consider using DigitalOcean's managed Kubernetes service
2. Set up load balancing
3. Use DigitalOcean's managed database service
4. Implement caching with Redis
5. Use CDN for static assets
