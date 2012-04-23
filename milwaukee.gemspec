$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "milwaukee/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "milwaukee"
  s.version     = Milwaukee::VERSION
  s.authors     = ["Timothy Cardenas"]
  s.email       = ["trcarden@gmail.com"]
  s.homepage    = "http://timcardenas.com"
  s.summary     = "My personal frontend toolkit"
  s.description = "Provides commonly used js and css components for my projects"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 3.2.3"

  s.add_development_dependency "sqlite3"
end
