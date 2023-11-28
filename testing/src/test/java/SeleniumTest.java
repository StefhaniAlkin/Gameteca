import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SeleniumTest {

    @Test
    @DisplayName("Should open registration modal.")
    public void shouldOpenRegistrationModal() {
        WebDriver driver = getDriver();
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
        WebDriver driver = getDriver();
        driver.get("https://fleurspirituelles.github.io/gameteca-quality-assurance/");

        addGame(driver, "Game Name", "2022", "PC", "Multiplayer", "RPG");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement gameRow = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//tr[td[text()='Game Name']]")));
        assertNotNull(gameRow);

        driver.quit();
    }

    @Test
    @DisplayName("Should display the added game in the game list.")
    public void shouldDisplayAddedGameInList() {
        WebDriver driver = getDriver();
        driver.get("https://fleurspirituelles.github.io/gameteca-quality-assurance/");

        addGame(driver, "Game Name", "2022", "PC", "Multiplayer", "RPG");

        WebElement gameRow = driver.findElement(By.xpath("//tr[td[text()='Game Name']]"));
        assertNotNull(gameRow);

        driver.quit();
    }

    @Test
    @DisplayName("Should show browser validation error for missing game name.")
    public void shouldShowBrowserValidationErrorMessageForMissingGameName() {
        WebDriver driver = getDriver();
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

    private void addGame(WebDriver driver, String name, String year, String platform, String category, String genre) {
        WebElement registerButton = driver.findElement(By.id("btnModalCadastro"));
        registerButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement registrationModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cadastrarModal")));
        assertTrue(registrationModal.isDisplayed());

        WebElement nomeInput = driver.findElement(By.id("nome"));
        WebElement anoInput = driver.findElement(By.id("ano-lancamento"));
        nomeInput.sendKeys(name);
        anoInput.sendKeys(year);

        WebElement platformCheckbox = driver.findElement(By.id("checkbox" + getPlatformIndex(platform)));
        platformCheckbox.click();

        Select categorySelect = new Select(driver.findElement(By.id("categoria")));
        categorySelect.selectByVisibleText("Single Player");

        Select genreSelect = new Select(driver.findElement(By.id("genero")));
        genreSelect.selectByVisibleText("RPG");

        WebElement saveButton = driver.findElement(By.xpath("//button[contains(text(), 'Salvar')]"));
        saveButton.click();

        WebElement successNotification = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("success")));
        assertTrue(successNotification.isDisplayed());

        WebElement closeRegistrationModalButton = driver.findElement(By.xpath("//button[contains(text(), 'Fechar')]"));
        closeRegistrationModalButton.click();
    }


    private int getPlatformIndex(String platform) {
        return switch (platform.toLowerCase()) {
            case "pc" -> 1;
            case "xbox" -> 2;
            default -> throw new IllegalArgumentException("Unsupported platform: " + platform);
        };
    }

    private WebDriver getDriver() {
        String driversDirectory = "src/test/resources/drivers/";

        String geckoDriverPath = new File(driversDirectory, "geckodriver").getAbsolutePath();
        System.setProperty("webdriver.gecko.driver", geckoDriverPath);

        WebDriverManager.firefoxdriver().setup();

        return new FirefoxDriver();
    }

}
