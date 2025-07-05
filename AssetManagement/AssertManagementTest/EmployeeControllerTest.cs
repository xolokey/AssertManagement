using NUnit.Framework;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using AssetManagement.Controllers;
using AssetManagement.Models;
using AssetManagement.DTOs;
using AssetManagement.Services.Interfaces;

namespace AssetManagement.Tests.Controllers
{
    [TestFixture]
    public class EmployeeControllerTests
    {
        private Mock<IEmployeeService> _mockService;
        private EmployeeController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockService = new Mock<IEmployeeService>();
            _controller = new EmployeeController(_mockService.Object);
        }

        [Test]
        public async Task GetAll_ReturnsListOfEmployeeDtos()
        {
            var employees = new List<Employee>
            {
                new Employee { EmployeeID = 1, Name = "John", Email = "john@test.com", Role = "Admin" }
            };

            _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(employees);

            var result = await _controller.GetAll();

            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var dtoList = okResult.Value as IEnumerable<EmployeeReadDto>;
            Assert.That(dtoList, Is.Not.Null);
            Assert.That(dtoList.Count(), Is.EqualTo(1));
            Assert.That(dtoList.First().Name, Is.EqualTo("John"));
        }

        [Test]
        public async Task GetById_ExistingEmployee_ReturnsDto()
        {
            var emp = new Employee { EmployeeID = 1, Name = "Alice", Email = "alice@test.com", Role = "User" };
            _mockService.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(emp);

            var result = await _controller.GetById(1);

            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var dto = okResult.Value as EmployeeReadDto;
            Assert.That(dto.Name, Is.EqualTo("Alice"));
        }

        [Test]
        public async Task GetById_NonExistingEmployee_ReturnsNotFound()
        {
            _mockService.Setup(s => s.GetByIdAsync(2)).ReturnsAsync((Employee)null);

            var result = await _controller.GetById(2);

            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task Update_ExistingEmployee_ReturnsUpdated()
        {
            var emp = new Employee { EmployeeID = 1, Name = "Updated" };
            _mockService.Setup(s => s.UpdateAsync(1, It.IsAny<Employee>())).ReturnsAsync(emp);

            var result = await _controller.Update(1, emp);

            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.That(okResult.Value, Is.EqualTo(emp));
        }

        [Test]
        public async Task Update_NonExistingEmployee_ReturnsNotFound()
        {
            _mockService.Setup(s => s.UpdateAsync(5, It.IsAny<Employee>())).ReturnsAsync((Employee)null);

            var result = await _controller.Update(5, new Employee());

            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task Delete_ExistingEmployee_ReturnsNoContent()
        {
            _mockService.Setup(s => s.DeleteAsync(1)).ReturnsAsync(true);

            var result = await _controller.Delete(1);

            Assert.IsInstanceOf<NoContentResult>(result);
        }

        [Test]
        public async Task Delete_NonExistingEmployee_ReturnsNotFound()
        {
            _mockService.Setup(s => s.DeleteAsync(99)).ReturnsAsync(false);

            var result = await _controller.Delete(99);

            Assert.IsInstanceOf<NotFoundResult>(result);
        }
    }
}
