provider "aws" {
  region = var.aws_region
}

resource "tls_private_key" "codemate_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = "codemate-ssh-key-3tier-modular"
  public_key = tls_private_key.codemate_key.public_key_openssh
}

module "networking" {
  source   = "./modules/networking"
  region   = var.aws_region
  vpc_cidr = var.vpc_cidr
}

module "security" {
  source = "./modules/security"
  vpc_id = module.networking.vpc_id
}

module "load_balancer" {
  source             = "./modules/load_balancer"
  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  alb_sg_id          = module.security.alb_sg_id
}

module "database" {
  source          = "./modules/database"
  instance_type   = var.instance_type
  data_subnet_ids = module.networking.data_subnet_ids
  data_sg_id      = module.security.data_sg_id
  key_name        = aws_key_pair.generated_key.key_name
}

module "compute" {
  source             = "./modules/compute"
  instance_type      = var.instance_type
  public_subnet_ids  = module.networking.public_subnet_ids
  app_subnet_ids     = module.networking.app_subnet_ids
  app_sg_id          = module.security.app_sg_id
  bastion_sg_id      = module.security.bastion_sg_id
  key_name           = aws_key_pair.generated_key.key_name
  alb_dns_name       = module.load_balancer.alb_dns_name
  mongodb_private_ip = module.database.mongodb_private_ip
  frontend_tg_arn    = module.load_balancer.frontend_tg_arn
  backend_tg_arn     = module.load_balancer.backend_tg_arn
  jwt_secret         = var.jwt_secret
  api_key            = var.api_key
}
