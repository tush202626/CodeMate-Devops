output "codemate_alb_url" {
  description = "The public URL to access the CodeMate Application"
  value       = "http://${module.load_balancer.alb_dns_name}"
}

output "bastion_public_ip" {
  description = "Public IP of the Bastion host (for SSH access to private instances)"
  value       = module.compute.bastion_public_ip
}

output "frontend_private_ip" {
  description = "Private IP of the React Frontend Server"
  value       = module.compute.frontend_private_ip
}

output "backend_private_ip" {
  description = "Private IP of the Node.js Backend Server"
  value       = module.compute.backend_private_ip
}

output "mongodb_private_ip" {
  description = "Private IP of the MongoDB Server"
  value       = module.database.mongodb_private_ip
}
