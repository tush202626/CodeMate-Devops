variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for Public Subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block for Private Subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "instance_type" {
  description = "EC2 Instance type"
  type        = string
  default     = "t2.micro"
}

variable "mongo_uri" {
  description = "MongoDB Connection String"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT Secret for backend authentication"
  type        = string
  sensitive   = true
}

variable "api_key" {
  description = "Judge0 API Key for code execution"
  type        = string
  sensitive   = true
}
