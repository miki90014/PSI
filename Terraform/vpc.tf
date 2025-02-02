resource "aws_vpc" "cinema_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "cinema-vpc"
  }
}

resource "aws_subnet" "public_subnet" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.cinema_vpc.id
  cidr_block              = element(var.public_subnet_cidrs, count.index)
  availability_zone       = element(var.availability_zones, count.index)
  map_public_ip_on_launch = true
  tags = {
    Name = "public-subnet ${count.index + 1}"
  }
}

resource "aws_subnet" "private_subnet" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.cinema_vpc.id
  cidr_block        = element(var.private_subnet_cidrs, count.index)
  availability_zone = element(var.availability_zones, count.index)
  tags = {
    Name = "private-subnet ${count.index + 1}"
  }
}

resource "aws_internet_gateway" "igw_cinema" {
  vpc_id = aws_vpc.cinema_vpc.id

  tags = {
    Name = "cinema-igw"
  }
}

resource "aws_route_table" "second_rt" {
  vpc_id = aws_vpc.cinema_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw_cinema.id
  }

  tags = {
    Name = "cinema-rt"
  }
}

resource "aws_route_table_association" "public_subnet_asso" {
  count          = length(var.public_subnet_cidrs)
  subnet_id      = element(aws_subnet.public_subnet[*].id, count.index)
  route_table_id = aws_route_table.second_rt.id
}

resource "aws_db_subnet_group" "my_db_subnet_group" {
  name       = "my-db-subnet-group"
  subnet_ids = aws_subnet.private_subnet[*].id
  tags = {
    Name = "My DB Subnet Group"
  }
}
