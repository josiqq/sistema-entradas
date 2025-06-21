CREATE TABLE Events (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    organizer VARCHAR(255),
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Tickets (
    ticket_id VARCHAR(50) PRIMARY KEY,
    event_id INT NOT NULL,
    holder_name VARCHAR(255) NOT NULL,
    holder_email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    purchase_date DATE NOT NULL,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    is_scanned BOOLEAN DEFAULT FALSE,
    scanned_time DATETIME,
    gate_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
);