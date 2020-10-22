using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace inventory.Models
{
    public class DashBoardPurchasePerDay
    {
        public string CurrentDate { get; set; }
        public string SellerId { get; set; }
    }

    public class DashBoardPurchasePerMonth
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string SellerId { get; set; }
    }

    public class DashBoardPurchaseOrderPerDay
    {
        public string CurrentDate { get; set; }
        public string SellerId { get; set; }
    }


    public class DashBoardPurchaseOrderPerMonth
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string SellerId { get; set; }
    }


    //public class DashBoardFastestMovingProductsPerMonth
    //{
    //    public string StartDate { get; set; }
    //    public string EndDate { get; set; }
    //    public string SellerId { get; set; }
    //}



    //public class DashBoardPurchasePerDayBL
    //{
    //    string strConn = ConfigurationManager.ConnectionStrings["sqlConnection"].ToString();
    //    public DataTable postPurchasePerDayToDb(DashBoardPurchasePerDay objDashBoardPurchasePerDay)
    //    {
   
    //        SqlCommand command = new SqlCommand();
    //        SqlConnection conn = new SqlConnection(strConn);
      
    //        conn.Open();
    //        command.Connection = conn;
    //        command.CommandType = CommandType.StoredProcedure;
    //        command.CommandText = "Mst_GetPurchasePerDay";

    //        command.Parameters.AddWithValue("@OrderDate", objDashBoardPurchasePerDay.CurrentDate);
    //        command.Parameters.AddWithValue("@SellerId", objDashBoardPurchasePerDay.SellerId);

    //        SqlDataAdapter adapter = new SqlDataAdapter(command);

    //        DataSet fileData = new DataSet();
    //        adapter.Fill(fileData, "fileData");
    //        conn.Close();
    //        DataTable firstTable = fileData.Tables[0];
    //        return firstTable;
    //    }
    //}

    public class DashBoardPurchasePerMonthBL
    {
        string strConn = ConfigurationManager.ConnectionStrings["sqlConnection"].ToString();
       
            public DataTable postPurchasePerMonthToDb(DashBoardPurchasePerMonth objDashBoardPurchasePerMonth)
            {
            SqlCommand command = new SqlCommand();
            SqlConnection conn = new SqlConnection(strConn);

            conn.Open();
            command.Connection = conn;
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "Mst_GetPurchasePerMonth";

            command.Parameters.AddWithValue("@SellerId", objDashBoardPurchasePerMonth.SellerId);
            command.Parameters.AddWithValue("@OrderDate", objDashBoardPurchasePerMonth.StartDate);
            command.Parameters.AddWithValue("@DeliveryDate", objDashBoardPurchasePerMonth.EndDate);
            

            SqlDataAdapter adapter = new SqlDataAdapter(command);

            DataSet fileData = new DataSet();
            adapter.Fill(fileData, "fileData");
            conn.Close();
            DataTable firstTable = fileData.Tables[0];
            return firstTable;
        }
    }

    public class DashBoardPurchaseOrderPerDayBL
    {
        string strConn = ConfigurationManager.ConnectionStrings["sqlConnection"].ToString();
  
        public DataTable postPurchasePerOrderDb(DashBoardPurchaseOrderPerDay objDashBoardPurchaseOrderPerDay)
        {
            SqlCommand command = new SqlCommand();
            SqlConnection conn = new SqlConnection(strConn);

            conn.Open();
            command.Connection = conn;
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "Mst_GetPurchaseOrderPerDay";

            command.Parameters.AddWithValue("@SellerId", objDashBoardPurchaseOrderPerDay.SellerId);
            command.Parameters.AddWithValue("@OrderDate", objDashBoardPurchaseOrderPerDay.CurrentDate);
            
            SqlDataAdapter adapter = new SqlDataAdapter(command);

            DataSet fileData = new DataSet();
            adapter.Fill(fileData, "fileData");
            conn.Close();
            DataTable firstTable = fileData.Tables[0];
            return firstTable;
        }
    }
    //Mst_GetPurchaseOrderPerMonth

    //public class DashBoardPurchaseOrderPerMonthBL
    //{
    //    string strConn = ConfigurationManager.ConnectionStrings["sqlConnection"].ToString();

    //    public DataTable postPurchaseOrderPerMonthToDb(DashBoardPurchaseOrderPerMonth objDashBoardPurchaseOrderPerMonth)
    //    {
    //        SqlCommand command = new SqlCommand();
    //        SqlConnection conn = new SqlConnection(strConn);

    //        conn.Open();
    //        command.Connection = conn;
    //        command.CommandType = CommandType.StoredProcedure;
    //        command.CommandText = "Mst_GetPurchaseOrderPerMonth";

    //        command.Parameters.AddWithValue("@SellerId", objDashBoardPurchaseOrderPerMonth.SellerId);
    //        command.Parameters.AddWithValue("@OrderDate", objDashBoardPurchaseOrderPerMonth.StartDate);
    //        command.Parameters.AddWithValue("@DeliveryDate", objDashBoardPurchaseOrderPerMonth.EndDate);


    //        SqlDataAdapter adapter = new SqlDataAdapter(command);

    //        DataSet fileData = new DataSet();
    //        adapter.Fill(fileData, "fileData");
    //        conn.Close();
    //        DataTable firstTable = fileData.Tables[0];
    //        return firstTable;
    //    }
    //}

    //public class FastestMovingProductsPerMonthBL
    //{
    //    string strConn = ConfigurationManager.ConnectionStrings["sqlConnection"].ToString();

    //    public DataTable postFastestMovingProductsToDb(DashBoardFastestMovingProductsPerMonth objDashBoardFastestMovingProductsPerMonth)
    //    {
    //        SqlCommand command = new SqlCommand();
    //        SqlConnection conn = new SqlConnection(strConn);

    //        conn.Open();
    //        command.Connection = conn;
    //        command.CommandType = CommandType.StoredProcedure;
    //        command.CommandText = "Mst_GetFastestMovingProductsPerMonth";

    //        command.Parameters.AddWithValue("@SellerId", objDashBoardFastestMovingProductsPerMonth.SellerId);
    //        command.Parameters.AddWithValue("@OrderDate", objDashBoardFastestMovingProductsPerMonth.StartDate);
    //        command.Parameters.AddWithValue("@DeliveryDate", objDashBoardFastestMovingProductsPerMonth.EndDate);


    //        SqlDataAdapter adapter = new SqlDataAdapter(command);

    //        DataSet fileData = new DataSet();
    //        adapter.Fill(fileData, "fileData");
    //        conn.Close();
    //        DataTable firstTable = fileData.Tables[0];
    //        return firstTable;
    //    }
    //}



    public class FastestMovingProductsPerMonthBL
    {
        string strConn = ConfigurationManager.ConnectionStrings["sqlConnection"].ToString();

        public DataTable postFastestMovingProductsToDb(string SellerId)
        {
            SqlCommand command = new SqlCommand();
            SqlConnection conn = new SqlConnection(strConn);

            conn.Open();
            command.Connection = conn;
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "Mst_GetFastestMovingProductsPerMonth";

            command.Parameters.AddWithValue("@SellerId", SellerId);
          

            SqlDataAdapter adapter = new SqlDataAdapter(command);

            DataSet fileData = new DataSet();
            adapter.Fill(fileData, "fileData");
            conn.Close();
            DataTable firstTable = fileData.Tables[0];
            return firstTable;
        }
    }

}