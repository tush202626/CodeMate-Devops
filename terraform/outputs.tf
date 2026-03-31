output "frontend_public_ip" {
  description = "Public IP address of the React Frontend Server"
  value       = aws_instance.frontend.public_ip
}

output "backend_public_ip" {
  description = "Public IP address of the Node.js Backend Server (for direct connections)"
  value       = aws_instance.backend.public_ip
}

output "frontend_url" {
  description = "Access the dashboard directly via HTTP"
  value       = "http://${aws_instance.frontend.public_ip}"
}
