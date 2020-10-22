USE [inventory]
GO
/****** Object:  Table [dbo].[Mst_App_Address]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Mst_App_Address](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sellerId] [int] NULL,
	[vendorId] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[mobileNumber] [varchar](255) NULL,
	[houseNO] [varchar](255) NULL,
	[society] [varchar](255) NULL,
	[landmark] [varchar](255) NULL,
	[pincode] [int] NULL,
	[city] [varchar](255) NULL,
	[area] [varchar](255) NULL,
	[state] [varchar](255) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Mst_PurchaseProducts]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Mst_PurchaseProducts](
	[PurchaseProductId] [int] IDENTITY(1,1) NOT NULL,
	[VendorCode] [varchar](255) NULL,
	[SellerId] [int] NULL,
	[OrderNo] [varchar](255) NULL,
	[OrderDate] [varchar](255) NULL,
	[DeliveryDate] [varchar](255) NULL,
	[AddressId] [int] NULL,
	[DeliveryType] [varchar](255) NULL,
	[PaymentType] [varchar](255) NULL,
	[DeliveryTime] [varchar](255) NULL,
	[CreatedAt] [datetime] NULL,
	[VendorName] [varchar](255) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Mst_PurchaseProductsItem]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Mst_PurchaseProductsItem](
	[PurchaseProductsItemId] [int] IDENTITY(1,1) NOT NULL,
	[SellerId] [int] NULL,
	[BrandId] [int] NULL,
	[ProductId] [int] NULL,
	[Discount] [int] NULL,
	[FinalPrice] [int] NULL,
	[MRP] [int] NULL,
	[Quantity] [int] NULL,
	[RequiredQuantity] [int] NULL,
	[Unit] [varchar](255) NULL,
	[id] [int] NULL,
	[name] [varchar](255) NULL,
	[VendorCode] [varchar](255) NULL,
	[PurchaseProductId] [int] NULL,
	[CategoryId] [int] NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  StoredProcedure [dbo].[getAllAPPAddress]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getAllAPPAddress](
	 @vendorId varchar(255)
) AS
BEGIN
	SELECT * 
 	FROM Mst_App_Address
	WHERE vendorId = @vendorId;
END 

GO
/****** Object:  StoredProcedure [dbo].[Mst_App_InsertAddress]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Mst_App_InsertAddress](
@sellerId int,
@vendorId varchar(255),
@name varchar(255),
@mobileNumber varchar(255),
@houseNo varchar(255),
@society varchar(255),
@landMark varchar(255),
@pinCode varchar(255),
@city varchar(255),
@area varchar(255),
@state varchar(255))
AS
BEGIN

	insert into Mst_App_Address(sellerId,vendorId,name,mobileNumber,houseNo,society,landMark,
	pinCode,city,area,state) 
	VALUES(@sellerId,@vendorId,@name,@mobileNumber,@houseNo,@society,@landMark,@pinCode,@city,@area,@state);

END
GO
/****** Object:  StoredProcedure [dbo].[Mst_App_updateAddressMaster]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Mst_App_updateAddressMaster](
@id INT,
@sellerId int,
@vendorId varchar(255),
@name varchar(255),
@mobileNumber varchar(255),
@houseNo varchar(255),
@society varchar(255),
@landMark varchar(255),
@pinCode varchar(255),
@city varchar(255),
@area varchar(255),
@state varchar(255)
) AS
BEGIN
UPDATE Mst_App_Address
   SET
	sellerId=@sellerId,
	vendorId=@vendorId,
	name=@name,
	mobileNumber=@mobileNumber,
	houseNo=@houseNo,
	society=@society,
	landMark=@landMark,
	pinCode=@pinCode,
	city=@city,
	area=@area,
	state=@state
 WHERE id=@id;

END 
GO
/****** Object:  StoredProcedure [dbo].[Mst_GetMyOrdersData]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Mst_GetMyOrdersData]
 @VendorCode varchar(50),
 @VendorName varchar(50),
 @OrderDate varchar(50),
 @DeliveryDate varchar(50),
 @SellerId varchar(50),
 @OrderNo varchar(50)
  
AS  
BEGIN  

		DECLARE @sqql nvarchar(max);
	         
		SET @sqql='select Mst_PurchaseProducts.PurchaseProductId,
		Mst_PurchaseProducts.SellerId,
		Mst_PurchaseProducts.DeliveryDate,
		Mst_PurchaseProducts.DeliveryType,
		Mst_PurchaseProducts.PaymentType,
		Mst_PurchaseProducts.DeliveryTime,
		Mst_PurchaseProducts.VendorName,
		Mst_PurchaseProducts.VendorCode,
		Mst_PurchaseProducts.OrderNo,
		Mst_PurchaseProducts.OrderDate
		from Mst_PurchaseProducts
		where Mst_PurchaseProducts.VendorCode= '''+@VendorCode+ '''
		and Mst_PurchaseProducts.SellerId= '''+@SellerId+ ''' 
		and Mst_PurchaseProducts.VendorName='''+@VendorName+''' '


   	IF(@OrderDate != 'ALL')
	BEGIN
	SET @sqql=@sqql + 'and Mst_PurchaseProducts.OrderDate=  ''' + @OrderDate + ''' '
	END

	IF(@DeliveryDate != 'ALL')
	BEGIN
	SET @sqql=@sqql + 'and Mst_PurchaseProducts.DeliveryDate=  ''' + @DeliveryDate + ''' '
	END

	IF(@OrderNo != 'ALL')
	BEGIN
	SET @sqql=@sqql + 'and Mst_PurchaseProducts.OrderNo=  ''' + @OrderNo + ''' '
	END

	Execute SP_EXECUTESQL @sqql
END 
GO
/****** Object:  StoredProcedure [dbo].[Mst_GetMyOrdersDataByPurchaseProductId]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Mst_GetMyOrdersDataByPurchaseProductId](
	 @PurchaseProductId int
) AS
BEGIN
select Mst_App_Address.name as customerName,Mst_App_Address.mobileNumber, Mst_App_Address.houseNO, Mst_App_Address.society,Mst_App_Address.landmark
,Mst_App_Address.pincode,Mst_App_Address.city,Mst_App_Address.area,Mst_App_Address.state,Mst_PurchaseProductsItem.PurchaseProductsItemId,Mst_PurchaseProductsItem.SellerId,Mst_PurchaseProductsItem.ProductId,
Mst_PurchaseProductsItem.BrandId,Mst_PurchaseProductsItem.Discount,Mst_PurchaseProductsItem.FinalPrice,Mst_PurchaseProductsItem.MRP,
Mst_PurchaseProductsItem.Quantity,Mst_PurchaseProductsItem.RequiredQuantity,Mst_PurchaseProductsItem.Unit,
Mst_PurchaseProductsItem.id,Mst_PurchaseProductsItem.name,Mst_PurchaseProductsItem.VendorCode,Mst_PurchaseProductsItem.PurchaseProductId,
Mst_PurchaseProducts.OrderNo,Mst_PurchaseProducts.OrderDate,Mst_PurchaseProducts.DeliveryDate,Mst_PurchaseProducts.AddressId,
Mst_PurchaseProducts.DeliveryType,Mst_PurchaseProducts.PaymentType,Mst_PurchaseProducts.DeliveryTime,Mst_PurchaseProducts.VendorName,
Mst_PurchaseProductsItem.CategoryId
 
 from Mst_PurchaseProductsItem,Mst_PurchaseProducts,Mst_App_Address
 where Mst_PurchaseProductsItem.PurchaseProductId= @PurchaseProductId
 and Mst_PurchaseProducts.PurchaseProductId=@PurchaseProductId
 and Mst_PurchaseProducts.AddressId=Mst_App_Address.id
END 
GO
/****** Object:  StoredProcedure [dbo].[Mst_insertPurchaseProduct]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Mst_insertPurchaseProduct](
@VendorCode VARCHAR(255),
@SellerId int,
@OrderNo VARCHAR(255),
@OrderDate VARCHAR(255),
@DeliveryDate VARCHAR(255),
@AddressId int,
@DeliveryType varchar(255),
@PaymentType varchar(255),
@DeliveryTime varchar(255),
@VendorName varchar(255),
@id int output)
AS
BEGIN

	insert into Mst_PurchaseProducts(VendorCode,SellerId,OrderNo,OrderDate,DeliveryDate,AddressId,DeliveryType,PaymentType,
	DeliveryTime,VendorName,CreatedAt) VALUES(@VendorCode,@SellerId,@OrderNo,@OrderDate,
	@DeliveryDate,@AddressId,@DeliveryType,@PaymentType,@DeliveryTime,@VendorName,GETDATE())
	SET @id=SCOPE_IDENTITY()
    RETURN  @id

END
GO
/****** Object:  StoredProcedure [dbo].[Mst_insertPurchaseProductItem]    Script Date: 22-10-2020 16:54:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Mst_insertPurchaseProductItem](
@PurchaseProductId int,
@VendorCode VARCHAR(255),
@SellerId int,
@BrandId int,
@ProductId int,
@Discount int,
@FinalPrice int,
@MRP int,
@Quantity int,
@RequiredQuantity int,
@Unit VARCHAR(255),
@id int,
@name  VARCHAR(255),
@CategoryId int)
AS
BEGIN

	insert into Mst_PurchaseProductsItem(PurchaseProductId,VendorCode,SellerId,BrandId,ProductId,
	Discount,FinalPrice,MRP,Quantity,RequiredQuantity,Unit,id,name,CategoryId) VALUES
	(@PurchaseProductId,@VendorCode,@SellerId,@BrandId,@ProductId,@Discount,@FinalPrice,@MRP,
	@Quantity,@RequiredQuantity,@Unit,@id,@name,@CategoryId)
END
GO
