# A. Security Group for the Frontend (Tier 1)
resource "aws_security_group" "frontend_sg" {
  name        = "CodeMate-Frontend-SG"
  description = "Allows HTTP and Custom React Port Traffic to Frontend EC2"
  vpc_id      = aws_vpc.codemate_vpc.id

  # SSH for administrative debugging
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # React Vite Development/Production Port
  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Standard HTTP (just in case they use Nginx later)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic (to pull code/docker images)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "CodeMate-Frontend-SG"
  }
}

# B. Security Group for the Backend (Tier 2)
resource "aws_security_group" "backend_sg" {
  name        = "CodeMate-Backend-SG"
  description = "Backend App Tier - Allows Socket/API traffic"
  vpc_id      = aws_vpc.codemate_vpc.id

  # SSH for administrative debugging
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Express/Socket.io API Port
  # NOTE: In Single-Page Applications (SPAs), the end-user's browser natively contacts the backend! 
  # So this must be open to the world, not just the Frontend EC2 security group.
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic (to pull code, talk to MongoDB Atlas, and fetch Judge0 languages)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "CodeMate-Backend-SG"
  }
}
