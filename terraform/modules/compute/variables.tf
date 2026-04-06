variable "instance_type" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "app_subnet_ids" {
  type = list(string)
}

variable "app_sg_id" {
  type = string
}

variable "bastion_sg_id" {
  type = string
}

variable "key_name" {
  type = string
}

variable "alb_dns_name" {
  type = string
}

variable "mongodb_private_ip" {
  type = string
}

variable "frontend_tg_arn" {
  type = string
}

variable "backend_tg_arn" {
  type = string
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "api_key" {
  type      = string
  sensitive = true
}
