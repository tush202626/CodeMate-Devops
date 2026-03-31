provider "aws" {
  region = var.aws_region
}

# 1. Provide an isolated VPC
resource "aws_vpc" "codemate_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "CodeMate-VPC"
  }
}

# 2. Internet Gateway (To allow traffic from the internet to the VPC)
resource "aws_internet_gateway" "codemate_igw" {
  vpc_id = aws_vpc.codemate_vpc.id

  tags = {
    Name = "CodeMate-IGW"
  }
}

# 3. Public Subnet (For Frontend & Backend internet access)
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.codemate_vpc.id
  cidr_block              = var.public_subnet_cidr
  map_public_ip_on_launch = true # Automatically give EC2 instances a public IP
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "CodeMate-Public-Subnet"
  }
}

# 4. Route Table (Routing traffic through the Internet Gateway)
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.codemate_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.codemate_igw.id
  }

  tags = {
    Name = "CodeMate-Public-RT"
  }
}

# 5. Route Table Association (Binding Subnet to the Route Table)
resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}
