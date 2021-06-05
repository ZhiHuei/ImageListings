BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS Download (
	ID SERIAL PRIMARY KEY NOT NULL,
	requestDate DATE NOT NULL,
	ImageId int NOT NULL,
	IpAddress TEXT NOT NULL,
	FOREIGN KEY (ImageId) REFERENCES ImageDetails(ID),
	FOREIGN KEY (IpAddress) REFERENCES UserDetails(IpAddress)
);

COMMIT;
