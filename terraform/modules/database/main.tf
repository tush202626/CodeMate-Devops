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

resource "aws_instance" "mongodb" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = var.data_subnet_ids[0]
  vpc_security_group_ids = [var.data_sg_id]
  key_name      = var.key_name

  root_block_device {
    volume_size = 14
  }

  tags = {
    Name = "CodeMate-Database-Tier"
  }

  user_data = <<-EOF
    #!/bin/bash
    set -e
    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

    # Wait for NAT Gateway to be fully provisioned
    until ping -c 1 8.8.8.8 &>/dev/null; do
      sleep 5
    done
    
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y docker.io

    systemctl start docker
    systemctl enable docker

    docker run -d \
      --name mongo \
      --restart always \
      -p 0.0.0.0:27017:27017 \
      -v /mongo_data:/data/db \
      mongo:7
  EOF
}
