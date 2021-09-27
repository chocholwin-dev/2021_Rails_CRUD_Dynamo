# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
1. aws cli install
 https://awscli.amazonaws.com/AWSCLIV2.msi
 >> after aws cli installation complete, check aws cli version
  $ aws --version
 p.s: you have to reopen vs code .
2. docker install
  https://www.docker.com/products/docker-desktop

3. setting aws cli configure
  $ aws configure

  >AWS Access Key ID [None]: 1234567890
  >AWS Secret Access Key [None]: 0987654321
  >Default region name [None]: ap-northeast-1
  >Default output format [None]: json



* connect to dynamodb
dynamo_db = Aws::DynamoDB::Client.new(
  region: "your-region",
  access_key_id: "anykey-or-xxx",
  secret_access_key: "anykey-or-xxx",
  endpoint: "http://localhost:8080"
)

