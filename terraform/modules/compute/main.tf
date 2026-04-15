data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "bastion" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = var.public_subnet_ids[0]
  vpc_security_group_ids = [var.bastion_sg_id]
  key_name      = var.key_name

  tags = {
    Name = "CodeMate-Bastion-Host"
  }
}

resource "aws_instance" "backend" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = var.app_subnet_ids[1]
  vpc_security_group_ids = [var.app_sg_id]
  key_name      = var.key_name

  root_block_device {
    volume_size = 14
  }

  tags = {
    Name = "CodeMate-Backend-Tier"
  }

  user_data_replace_on_change = true

  user_data = <<-EOF
    #!/bin/bash
    set -e
    # FORCE REBUILD 5
    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

    # Wait for NAT Gateway to be fully provisioned
    until ping -c 1 8.8.8.8 &>/dev/null; do
      sleep 5
    done

    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y docker.io docker-compose-v2 git curl netcat-openbsd

    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    
    systemctl enable docker
    systemctl start docker

    cd /home/ubuntu
    git clone https://github.com/tush202626/CodeMate-Devops.git app
    cd app/CodeMate-main

    echo "MONGO_URI=mongodb://${var.mongodb_private_ip}:27017/codemate" > .env
    echo "JWT_SECRET=${var.jwt_secret}" >> .env
    echo "API_KEY=${var.api_key}" >> .env
    
    cp .env server/.env

    apt-get install -y netcat-openbsd
    echo "Waiting for MongoDB on ${var.mongodb_private_ip}:27017..."
    while ! nc -z ${var.mongodb_private_ip} 27017; do
      sleep 5
    done
    echo "MongoDB is up! Starting backend."

    docker compose up -d --build backend
  EOF
}

resource "aws_lb_target_group_attachment" "backend_attach" {
  target_group_arn = var.backend_tg_arn
  target_id        = aws_instance.backend.id
  port             = 5000
}


resource "aws_instance" "frontend" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = var.app_subnet_ids[0]
  vpc_security_group_ids = [var.app_sg_id]
  key_name      = var.key_name

  root_block_device {
    volume_size = 14
  }

  tags = {
    Name = "CodeMate-Frontend-Tier"
  }
  
  user_data_replace_on_change = true

  user_data = <<-EOF
    #!/bin/bash
    set -e
    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

    # Wait for NAT Gateway to be fully provisioned
    until ping -c 1 8.8.8.8 &>/dev/null; do
      sleep 5
    done
    
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y docker.io docker-compose-v2 git curl

    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    
    systemctl enable docker
    systemctl start docker

    cd /home/ubuntu
    git clone https://github.com/tush202626/CodeMate-Devops.git app
    cd app/CodeMate-main

    echo "VITE_BACKEND_URL=http://${var.alb_dns_name}/" > .env
    echo "VITE_BACKEND_URL=http://${var.alb_dns_name}/" > client/.env

    docker compose up -d --build --no-deps frontend
  EOF
}

resource "aws_lb_target_group_attachment" "frontend_attach" {
  target_group_arn = var.frontend_tg_arn
  target_id        = aws_instance.frontend.id
  port             = 5173
}
