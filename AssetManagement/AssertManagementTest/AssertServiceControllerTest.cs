using NUnit.Framework;
using Moq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using AssetManagement.Controllers;
using AssetManagement.Models;
using AssetManagement.DTOs;
using AssetManagement.Services.Interfaces;
using System;

namespace AssetManagement.Tests.Controllers
{
    [TestFixture]
    public class AssetServiceRequestControllerTests
    {
        private Mock<IAssetServiceRequestService> _mockService;
        private AssetServiceRequestController _controller;

        [SetUp]
        public void Setup()
        {
            _mockService = new Mock<IAssetServiceRequestService>();
            _controller = new AssetServiceRequestController(_mockService.Object);
        }

        [Test]
        public async Task GetAll_ReturnsListOfServiceRequests()
        {
            var mockData = new List<AssetServiceRequest>
            {
                new AssetServiceRequest
                {
                    ServiceRequestID = 1,
                    EmployeeID = 1,
                    AssetID = 2,
                    Employee = new Employee { Name = "Alice" },
                    Asset = new Asset { AssetName = "Laptop" },
                    IssueType = "Damage",
                    Description = "Broken screen",
                    RequestDate = DateTime.Now,
                    Status = "Pending"
                }
            };

            _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(mockData);

            var result = await _controller.GetAll() as OkObjectResult;

            Assert.IsNotNull(result);
            var dtoList = result.Value as IEnumerable<AssetServiceRequestReadDto>;
            Assert.AreEqual(1, dtoList.Count());
            Assert.AreEqual("Damage", dtoList.First().IssueType);
        }

        [Test]
        public async Task GetById_ExistingId_ReturnsServiceRequest()
        {
            var mockRequest = new AssetServiceRequest
            {
                ServiceRequestID = 1,
                EmployeeID = 1,
                AssetID = 2,
                Employee = new Employee { Name = "Bob" },
                Asset = new Asset { AssetName = "Projector" },
                IssueType = "Repair",
                Description = "Not working",
                RequestDate = DateTime.Now,
                Status = "InProgress"
            };

            _mockService.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(mockRequest);

            var result = await _controller.GetById(1) as OkObjectResult;

            Assert.IsNotNull(result);
            var dto = result.Value as AssetServiceRequestReadDto;
            Assert.AreEqual("Repair", dto.IssueType);
        }

        [Test]
        public async Task GetById_NonExistingId_ReturnsNotFound()
        {
            _mockService.Setup(s => s.GetByIdAsync(99)).ReturnsAsync((AssetServiceRequest)null);

            var result = await _controller.GetById(99);

            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task Create_ValidDto_ReturnsCreatedAt()
        {
            var createDto = new AssetServiceRequestCreateDto
            {
                EmployeeID = 1,
                AssetID = 2,
                IssueType = "Battery Issue",
                Description = "Battery drains fast",
                RequestDate = DateTime.Now,
                Status = "New"
            };

            var created = new AssetServiceRequest
            {
                ServiceRequestID = 100,
                EmployeeID = 1,
                AssetID = 2,
                IssueType = "Battery Issue",
                Description = "Battery drains fast",
                RequestDate = createDto.RequestDate,
                Status = "New"
            };

            _mockService.Setup(s => s.CreateAsync(It.IsAny<AssetServiceRequest>()))
                        .ReturnsAsync(created);

            var result = await _controller.Create(createDto) as CreatedAtActionResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(100, ((AssetServiceRequest)result.Value).ServiceRequestID);
        }

        [Test]
        public async Task Update_ExistingId_ReturnsUpdatedObject()
        {
            var updated = new AssetServiceRequest
            {
                ServiceRequestID = 1,
                Status = "Completed"
            };

            _mockService.Setup(s => s.UpdateAsync(1, It.IsAny<AssetServiceRequest>()))
                        .ReturnsAsync(updated);

            var result = await _controller.Update(1, updated) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual("Completed", ((AssetServiceRequest)result.Value).Status);
        }

        [Test]
        public async Task Update_NonExistingId_ReturnsNotFound()
        {
            _mockService.Setup(s => s.UpdateAsync(99, It.IsAny<AssetServiceRequest>()))
                        .ReturnsAsync((AssetServiceRequest)null);

            var result = await _controller.Update(99, new AssetServiceRequest());

            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task Delete_ExistingId_ReturnsNoContent()
        {
            _mockService.Setup(s => s.DeleteAsync(1)).ReturnsAsync(true);

            var result = await _controller.Delete(1);

            Assert.IsInstanceOf<NoContentResult>(result);
        }

        [Test]
        public async Task Delete_NonExistingId_ReturnsNotFound()
        {
            _mockService.Setup(s => s.DeleteAsync(99)).ReturnsAsync(false);

            var result = await _controller.Delete(99);

            Assert.IsInstanceOf<NotFoundResult>(result);
        }
    }
}
