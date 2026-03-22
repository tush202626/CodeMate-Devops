resource "aws_instance" "this" {
  ami           = "ami-0f5ee92e2d63afc18"
  instance_type = "t2.micro"

  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.sg_id]

  tags = {
    Name = var.instance_name
  }
}