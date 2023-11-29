import com.github.javafaker.Faker;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.time.Duration;
import java.util.List;
import org.openqa.selenium.NoSuchElementException;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SeleniumTest {

    private final Faker faker = new Faker();
    WebDriver driver;
    WebDriverWait wait;

    @BeforeEach
    void setUp() {
        driver = getDriver();
        driver.get("https://fleurspirituelles.github.io/gameteca-quality-assurance/");
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Should open registration modal.")
    public void shouldOpenRegistrationModal() {
        WebElement registerButton = driver.findElement(By.id("btnModalCadastro"));
        registerButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement registrationModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cadastrarModal")));

        assert registrationModal.isDisplayed();
    }

    @Test
    @DisplayName("Should add a new game.")
    public void shouldAddNewGameWithPlatformCategoryGenre() {
        String gameName = faker.gameOfThrones().character();
        String year = String.valueOf(faker.number().numberBetween(2000, 2023));
        String platform = faker.options().option("PC", "Xbox", "Playstation");

        addGame(driver, gameName, year, platform);

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement gameRow = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//tr[td[text()='" + gameName + "']]")));
        assertNotNull(gameRow);
    }

    @Test
    @DisplayName("Should delete a game and show success notification.")
    public void shouldDeleteGameAndShowSuccessNotification() {
        String gameName = faker.gameOfThrones().character();
        String year = String.valueOf(faker.number().numberBetween(2000, 2023));
        String platform = faker.options().option("PC", "Xbox", "Playstation");

        addGame(driver, gameName, year, platform);

        WebElement deleteButton = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("btnDelete")));
        assertNotNull(deleteButton);

        Actions actions = new Actions(driver);
        actions.moveByOffset(0, 200).perform();
        deleteButton.click();

        WebElement successNotification = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(@class, 'card-body') and contains(@class, 'success')]")));
        assertTrue(successNotification.isDisplayed());

        assertThrows(NoSuchElementException.class, () -> driver.findElement(By.xpath("//tr[td[text()='GameToDelete']]")));
    }

    @Test
    @DisplayName("Should display the added game in the game list.")
    public void shouldDisplayAddedGameInList() {
        String gameName = faker.gameOfThrones().character();
        String year = String.valueOf(faker.number().numberBetween(2000, 2023));
        String platform = faker.options().option("PC", "Xbox", "Playstation");

        addGame(driver, gameName, year, platform);

        WebElement gameRow = driver.findElement(By.xpath("//tr[td[text()='" + gameName + "']]"));
        assertNotNull(gameRow);
    }

    @Test
    @DisplayName("Should show browser validation error for missing game name.")
    public void shouldShowBrowserValidationErrorMessageForMissingGameName() {
        WebElement registerButton = driver.findElement(By.id("btnModalCadastro"));
        registerButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement registrationModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cadastrarModal")));
        assertTrue(registrationModal.isDisplayed());

        WebElement saveButton = driver.findElement(By.xpath("//button[contains(text(), 'Salvar')]"));
        saveButton.click();

        WebElement gameNameInput = driver.findElement(By.id("nome"));
        assertTrue(gameNameInput.isDisplayed());

        String dynamicGameName = faker.gameOfThrones().character();
        gameNameInput.sendKeys(dynamicGameName);
    }

    @Test
    @DisplayName("Should not save changes if all platforms are removed during editing.")
    public void shouldNotSaveChangesIfAllPlatformsRemovedDuringEditing() {
        String gameName = new Faker().gameOfThrones().character();
        addGame(driver, gameName, "2022", "PC");

        WebElement gameRow = driver.findElement(By.xpath("//tr[td[1][contains(text(), '" + gameName + "')]]"));
        assertNotNull(gameRow);

        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", gameRow.findElement(By.xpath(".//button[@class='btnEdit']")));

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement platformCheckboxesContainer = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("editarForm")));

        List<WebElement> platformCheckboxes = platformCheckboxesContainer.findElements(By.cssSelector("input[type='checkbox']"));

        for (WebElement checkbox : platformCheckboxes) {
            if (checkbox.isSelected()) {
                checkbox.click();
            }
        }

        WebElement saveButton = driver.findElement(By.id("salvarEdicao"));
        saveButton.click();
    }

    private void addGame(WebDriver driver, String name, String year, String platform) {
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
            case "playstation" -> 3;
            case "nintendo" -> 4;
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