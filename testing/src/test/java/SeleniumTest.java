import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.time.Duration;

public class SeleniumTest {

    @Test
    @DisplayName("Should open registration modal.")
    public void shouldOpenRegistrationModal() {
        String driversDirectory = "src/test/resources/drivers/";

        String geckoDriverPath = new File(driversDirectory, "geckodriver").getAbsolutePath();
        System.setProperty("webdriver.gecko.driver", geckoDriverPath);

        WebDriverManager.firefoxdriver().setup();

        WebDriver driver = new FirefoxDriver();

        driver.get("https://fleurspirituelles.github.io/gameteca-quality-assurance/");

        WebElement registerButton = driver.findElement(By.id("btnModalCadastro"));
        registerButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement registrationModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cadastrarModal")));

        assert registrationModal.isDisplayed();

        driver.quit();
    }

    @Test
    @DisplayName("Should add a new game.")
    public void shouldAddNewGameWithPlatformCategoryGenre() {
        String driversDirectory = "src/test/resources/drivers/";

        String geckoDriverPath = new File(driversDirectory, "geckodriver").getAbsolutePath();
        System.setProperty("webdriver.gecko.driver", geckoDriverPath);

        WebDriverManager.firefoxdriver().setup();

        WebDriver driver = new FirefoxDriver();

        driver.get("https://fleurspirituelles.github.io/gameteca-quality-assurance/");

        WebElement registerButton = driver.findElement(By.id("btnModalCadastro"));
        registerButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement registrationModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cadastrarModal")));
        assertTrue(registrationModal.isDisplayed());

        WebElement nomeInput = driver.findElement(By.id("nome"));
        WebElement anoInput = driver.findElement(By.id("ano-lancamento"));
        nomeInput.sendKeys("Game Name");
        anoInput.sendKeys("2022");

        WebElement platformPC = driver.findElement(By.id("checkbox1"));
        WebElement platformXbox = driver.findElement(By.id("checkbox2"));
        platformPC.click();
        platformXbox.click();

        Select categorySelect = new Select(driver.findElement(By.id("categoria")));
        categorySelect.selectByVisibleText("Multiplayer");

        Select genreSelect = new Select(driver.findElement(By.id("genero")));
        genreSelect.selectByVisibleText("RPG");

        WebElement saveButton = driver.findElement(By.xpath("//button[contains(text(), 'Salvar')]"));
        saveButton.click();

        WebElement successNotification = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("success")));
        assertTrue(successNotification.isDisplayed());

        WebElement gameRow = driver.findElement(By.xpath("//tr[td[text()='Game Name']]"));
        assertNotNull(gameRow);

        driver.quit();
    }

    @Test
    @DisplayName("Should show browser validation error for missing game name")
    public void shouldShowBrowserValidationErrorMessageForMissingGameName() {
        String driversDirectory = "src/test/resources/drivers/";

        String geckoDriverPath = new File(driversDirectory, "geckodriver").getAbsolutePath();
        System.setProperty("webdriver.gecko.driver", geckoDriverPath);

        WebDriverManager.firefoxdriver().setup();

        WebDriver driver = new FirefoxDriver();
        driver.get("https://fleurspirituelles.github.io/gameteca-quality-assurance/");

        WebElement registerButton = driver.findElement(By.id("btnModalCadastro"));
        registerButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement registrationModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cadastrarModal")));
        assertTrue(registrationModal.isDisplayed());

        WebElement saveButton = driver.findElement(By.xpath("//button[contains(text(), 'Salvar')]"));
        saveButton.click();

        WebElement gameNameInput = driver.findElement(By.id("nome"));
        assertTrue(gameNameInput.isDisplayed());

        driver.quit();
    }

}
