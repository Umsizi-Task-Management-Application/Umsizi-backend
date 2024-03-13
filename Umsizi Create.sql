USE MASTER
GO

CREATE DATABASE UmsiziDB
GO

USE UmsiziDB
GO


CREATE TABLE [dbo].[User](
[UserID] int IDENTITY(1,1) PRIMARY KEY,
[name] VARCHAR(120) NOT NULL,
[email] VARCHAR(130) UNIQUE NOT NULL
)
GO


CREATE TABLE [dbo].[Tasks](
 [TaskID] int IDENTITY(1,1) PRIMARY KEY NOT NULL,
 [UserID] int FOREIGN KEY REFERENCES [dbo].[User],
  [title] VARCHAR(90) NOT NULL,
  [description] VARCHAR(150) NOT NULL,
  [deadline] Date,
  [priority] VARCHAR(10) NOT NULL,
  [stage] VARCHAR(15) NOT NULL
  )
  GO

  SELECT * FROM [dbo].[User]
  SELECT * FROM [dbo].[Tasks]