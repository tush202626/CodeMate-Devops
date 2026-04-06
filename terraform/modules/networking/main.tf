resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "CodeMate-VPC"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "CodeMate-IGW"
  }
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.region}a"

  tags = {
    Name = "CodeMate-Public-Subnet-A"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.region}b"

  tags = {
    Name = "CodeMate-Public-Subnet-B"
  }
}

resource "aws_subnet" "app_a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.10.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "${var.region}a"

  tags = {
    Name = "CodeMate-App-Subnet-A"
  }
}

resource "aws_subnet" "app_b" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.11.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "${var.region}b"

  tags = {
    Name = "CodeMate-App-Subnet-B"
  }
}

resource "aws_subnet" "data_a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.20.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "${var.region}a"

  tags = {
    Name = "CodeMate-Data-Subnet-A"
  }
}

resource "aws_subnet" "data_b" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.21.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "${var.region}b"

  tags = {
    Name = "CodeMate-Data-Subnet-B"
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "this" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id

  tags = {
    Name = "CodeMate-NAT"
  }

  depends_on = [aws_internet_gateway.this]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name = "CodeMate-Public-RT"
  }
}

resource "aws_route_table_association" "pub_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}
resource "aws_route_table_association" "pub_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.this.id
  }

  tags = {
    Name = "CodeMate-Private-RT"
  }
}

resource "aws_route_table_association" "app_a" {
  subnet_id      = aws_subnet.app_a.id
  route_table_id = aws_route_table.private.id
}
resource "aws_route_table_association" "app_b" {
  subnet_id      = aws_subnet.app_b.id
  route_table_id = aws_route_table.private.id
}
resource "aws_route_table_association" "data_a" {
  subnet_id      = aws_subnet.data_a.id
  route_table_id = aws_route_table.private.id
}
resource "aws_route_table_association" "data_b" {
  subnet_id      = aws_subnet.data_b.id
  route_table_id = aws_route_table.private.id
}
