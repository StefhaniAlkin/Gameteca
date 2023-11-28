import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
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
}
