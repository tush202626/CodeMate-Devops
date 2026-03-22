provider "aws" {
  region = "ap-south-1"
}

module "vpc" {
  source = "../modules/vpc"
}
module "sg" {
  source = "../modules/security-group"
  vpc_id = module.vpc.vpc_id
}

# Frontend EC2 (Public)
module "frontend_ec2" {
  source        = "../modules/ec2"
  subnet_id     = module.vpc.public_subnet_id
  sg_id         = module.sg.frontend_sg_id
  instance_name = "frontend"
}

# Backend EC2 (Private)
module "backend_ec2" {
  source        = "../modules/ec2"
  subnet_id     = module.vpc.private_subnet_id
  sg_id         = module.sg.backend_sg_id
  instance_name = "backend"
}