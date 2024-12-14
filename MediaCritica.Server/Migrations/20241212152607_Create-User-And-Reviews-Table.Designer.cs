﻿// <auto-generated />
using System;
using MediaCritica.Server;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MediaCritica.Server.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20241212152607_Create-User-And-Reviews-Table")]
    partial class CreateUserAndReviewsTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("MediaCritica.Server.Objects.Review", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("MediaEpisode")
                        .HasColumnType("int");

                    b.Property<string>("MediaId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MediaParentId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MediaParentTitle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MediaPoster")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("MediaSeason")
                        .HasColumnType("int");

                    b.Property<string>("MediaTitle")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MediaType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Rating")
                        .HasColumnType("float");

                    b.Property<int>("ReviewerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ReviewerId");

                    b.ToTable("Reviews");
                });

            modelBuilder.Entity("MediaCritica.Server.Objects.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MediaCritica.Server.Objects.Review", b =>
                {
                    b.HasOne("MediaCritica.Server.Objects.User", "Reviewer")
                        .WithMany()
                        .HasForeignKey("ReviewerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Reviewer");
                });
#pragma warning restore 612, 618
        }
    }
}
