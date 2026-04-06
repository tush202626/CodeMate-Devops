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

    apt-get update
    apt-get install -y gnupg curl

    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
       gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
       --dearmor

    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

    apt-get update
    apt-get install -y mongodb-org

    sed -i 's/bindIp: 127.0.0.1/bindIp: 0.0.0.0/' /etc/mongod.conf

    systemctl start mongod
    systemctl enable mongod
  EOF
}
