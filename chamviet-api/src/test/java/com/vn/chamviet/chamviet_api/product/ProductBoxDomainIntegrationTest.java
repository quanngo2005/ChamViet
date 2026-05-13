package com.vn.chamviet.chamviet_api.product;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vn.chamviet.chamviet_api.entity.InventoryTransaction;
import com.vn.chamviet.chamviet_api.entity.OrderDetail;
import com.vn.chamviet.chamviet_api.entity.Orders;
import com.vn.chamviet.chamviet_api.entity.repository.InventoryTransactionRepo;
import com.vn.chamviet.chamviet_api.entity.repository.OrdersRepo;
import com.vn.chamviet.chamviet_api.product.dto.ProductDTO;
import com.vn.chamviet.chamviet_api.product.repository.AgeRangeRepo;
import com.vn.chamviet.chamviet_api.product.repository.CategoryRepo;
import com.vn.chamviet.chamviet_api.product.repository.ComponentItemRepo;
import com.vn.chamviet.chamviet_api.product.repository.ProductRepo;
import com.vn.chamviet.chamviet_api.product.repository.ProductVariantRepo;
import com.vn.chamviet.chamviet_api.product.service.BoxOrderService;
import com.vn.chamviet.chamviet_api.product.service.ComponentInventoryService;
import com.vn.chamviet.chamviet_api.product.service.ProductService;
import com.vn.chamviet.chamviet_api.product.service.ProductVariantCompositionService;
import com.vn.chamviet.chamviet_api.user.Account;
import com.vn.chamviet.chamviet_api.user.AccountRepo;
import com.vn.chamviet.chamviet_api.user.Role;
import com.vn.chamviet.chamviet_api.user.RoleRepo;
import jakarta.persistence.EntityManager;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Transactional
class ProductBoxDomainIntegrationTest {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private AgeRangeRepo ageRangeRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ProductVariantRepo productVariantRepo;

    @Autowired
    private ComponentItemRepo componentItemRepo;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductVariantCompositionService compositionService;

    @Autowired
    private ComponentInventoryService componentInventoryService;

    @Autowired
    private BoxOrderService boxOrderService;

    @Autowired
    private InventoryTransactionRepo inventoryTransactionRepo;

    @Autowired
    private OrdersRepo ordersRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Account account;
    private ProductVariant variant;
    private ComponentItem puzzleOne;
    private ComponentItem puzzleTwo;
    private ComponentItem pepperGhost;

    @BeforeEach
    void setUp() {
        Role role = roleRepo.save(Role.builder()
            .name("USER")
            .description("Customer")
            .build());

        account = accountRepo.save(Account.builder()
            .role(role)
            .email("buyer@example.com")
            .passwordHash("hash")
            .fullName("Buyer")
            .status(Account.AccountStatus.ACTIVE)
            .build());

        Category category = categoryRepo.save(Category.builder()
            .name("Puzzle Box")
            .slug("puzzle-box")
            .build());

        AgeRange ageRange = ageRangeRepo.save(AgeRange.builder()
            .name("4-6")
            .minAge(4)
            .maxAge(6)
            .build());

        Product product = Product.builder()
            .category(category)
            .name("Box Song Long")
            .slug("box-song-long")
            .description("Story box with two puzzle cards and one pepper ghost")
            .status(Product.ProductStatus.ACTIVE)
            .images(new ArrayList<>())
            .variants(new ArrayList<>())
            .build();
        product = productRepo.save(product);

        product.getImages().add(ProductImage.builder()
            .product(product)
            .imageUrl("https://img.example.com/song-long-box.jpg")
            .sortOrder(0)
            .isPrimary(true)
            .build());

        puzzleOne = componentItemRepo.save(ComponentItem.builder()
            .sku("PUZ-ONE")
            .name("Puzzle One")
            .componentType(ComponentItem.ComponentType.PUZZLE)
            .ageRange(ageRange)
            .videoUrl("https://www.youtube.com/watch?v=Mb0RWyh3sqQ")
            .storyTitle("Lac Long Quan")
            .storyContent("Story content one")
            .storyQaJson("[{\"question\":\"Q1\",\"answer\":\"A1\"}]")
            .pieceCount(12)
            .stockOnHand(10)
            .reservedStock(0)
            .status(ComponentItem.ComponentStatus.ACTIVE)
            .build());

        puzzleTwo = componentItemRepo.save(ComponentItem.builder()
            .sku("PUZ-TWO")
            .name("Puzzle Two")
            .componentType(ComponentItem.ComponentType.PUZZLE)
            .ageRange(ageRange)
            .videoUrl("https://www.youtube.com/watch?v=Mb0RWyh3sqQ")
            .storyTitle("Lac Long Quan")
            .storyContent("Story content two")
            .storyQaJson("[{\"question\":\"Q2\",\"answer\":\"A2\"}]")
            .pieceCount(18)
            .stockOnHand(10)
            .reservedStock(0)
            .status(ComponentItem.ComponentStatus.ACTIVE)
            .build());

        pepperGhost = componentItemRepo.save(ComponentItem.builder()
            .sku("PG-ONE")
            .name("Pepper Ghost")
            .componentType(ComponentItem.ComponentType.PEPPER_GHOST)
            .stockOnHand(10)
            .reservedStock(0)
            .status(ComponentItem.ComponentStatus.ACTIVE)
            .build());

        variant = ProductVariant.builder()
            .product(product)
            .ageRange(ageRange)
            .sku("BOX-001")
            .price(new BigDecimal("500000.00"))
            .components(new ArrayList<>())
            .build();

        ProductVariant savedVariant = productVariantRepo.save(variant);
        savedVariant.setComponents(new ArrayList<>(List.of(
            ProductVariantComponent.builder()
                .productVariant(savedVariant)
                .componentItem(puzzleOne)
                .quantity(1)
                .sortOrder(0)
                .build(),
            ProductVariantComponent.builder()
                .productVariant(savedVariant)
                .componentItem(puzzleTwo)
                .quantity(1)
                .sortOrder(1)
                .build(),
            ProductVariantComponent.builder()
                .productVariant(savedVariant)
                .componentItem(pepperGhost)
                .quantity(1)
                .sortOrder(2)
                .build()
        )));

        variant = productVariantRepo.save(savedVariant);
        product.getVariants().add(variant);
        productRepo.save(product);
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void shouldLoadDetailedProductWithVariantComposition() {
        ProductDTO productDTO = productService.getProduct(variant.getProduct().getId());

        assertEquals("Box Song Long", productDTO.getName());
        assertThat(productDTO.getImages()).hasSize(1);
        assertThat(productDTO.getVariants()).hasSize(1);
        assertThat(productDTO.getVariants().get(0).getComponents()).hasSize(3);
        assertEquals("PUZZLE", productDTO.getVariants().get(0).getComponents().get(0).getComponentType());
    }

    @Test
    void shouldRejectInvalidPuzzleMetadata() {
        ComponentItem invalidPuzzle = ComponentItem.builder()
            .sku("PUZ-BAD")
            .name("Broken Puzzle")
            .componentType(ComponentItem.ComponentType.PUZZLE)
            .stockOnHand(1)
            .reservedStock(0)
            .status(ComponentItem.ComponentStatus.ACTIVE)
            .build();

        assertThrows(ConstraintViolationException.class, () -> {
            componentItemRepo.saveAndFlush(invalidPuzzle);
            entityManager.flush();
        });
    }

    @Test
    void shouldRejectPepperGhostWithStoryMetadata() {
        ComponentItem invalidPepperGhost = ComponentItem.builder()
            .sku("PG-BAD")
            .name("Pepper Ghost Invalid")
            .componentType(ComponentItem.ComponentType.PEPPER_GHOST)
            .videoUrl("https://www.youtube.com/watch?v=Mb0RWyh3sqQ")
            .stockOnHand(1)
            .reservedStock(0)
            .status(ComponentItem.ComponentStatus.ACTIVE)
            .build();

        assertThrows(ConstraintViolationException.class, () -> {
            componentItemRepo.saveAndFlush(invalidPepperGhost);
            entityManager.flush();
        });
    }

    @Test
    void shouldRejectInvalidBoxComposition() {
        ProductVariant invalidVariant = ProductVariant.builder()
            .components(List.of(
                ProductVariantComponent.builder().componentItem(puzzleOne).quantity(1).build(),
                ProductVariantComponent.builder().componentItem(pepperGhost).quantity(1).build()
            ))
            .build();

        assertThrows(IllegalArgumentException.class, () -> compositionService.validateBoxVariant(invalidVariant));
    }

    @Test
    void shouldReserveReleaseAndConsumeComponentInventory() {
        componentInventoryService.reserveComponents(variant.getId(), 2, 101L, "Reserve two boxes");

        ComponentItem reservedPuzzle = componentItemRepo.findById(puzzleOne.getId()).orElseThrow();
        ComponentItem reservedGhost = componentItemRepo.findById(pepperGhost.getId()).orElseThrow();
        assertEquals(2, reservedPuzzle.getReservedStock());
        assertEquals(2, reservedGhost.getReservedStock());

        componentInventoryService.releaseComponents(variant.getId(), 1, 101L, "Release one box");
        assertEquals(1, componentItemRepo.findById(puzzleOne.getId()).orElseThrow().getReservedStock());

        componentInventoryService.consumeReservedComponents(variant.getId(), 1, 101L, "Consume one box");
        ComponentItem consumedPuzzle = componentItemRepo.findById(puzzleOne.getId()).orElseThrow();
        ComponentItem consumedGhost = componentItemRepo.findById(pepperGhost.getId()).orElseThrow();

        assertEquals(0, consumedPuzzle.getReservedStock());
        assertEquals(9, consumedPuzzle.getStockOnHand());
        assertEquals(9, consumedGhost.getStockOnHand());
        assertThat(inventoryTransactionRepo.findByReferenceIdOrderByIdAsc(101L)).hasSize(9);
    }

    @Test
    void shouldCreateCancelAndPackOrderWithSnapshots() throws Exception {
        Orders created = boxOrderService.createOrder(new BoxOrderService.CreateBoxOrderCommand(
            account.getId(),
            variant.getId(),
            1,
            null,
            "Ha Noi",
            "Hoan Kiem",
            "Hang Bac",
            "1 Tran Quang Khai",
            "1 Tran Quang Khai, Ha Noi",
            null,
            null,
            account.getId()
        ));

        Orders saved = ordersRepo.findById(created.getId()).orElseThrow();
        assertEquals(Orders.OrderStatus.RESERVED, saved.getStatus());
        OrderDetail detail = saved.getOrderDetails().get(0);
        assertEquals("BOX-001", detail.getSnapshotVariantSku());
        assertEquals(3, objectMapper.readTree(detail.getSnapshotComponentsJson()).size());
        assertEquals(1, componentItemRepo.findById(puzzleOne.getId()).orElseThrow().getReservedStock());

        ProductVariant reloadedVariant = productVariantRepo.findById(variant.getId()).orElseThrow();
        reloadedVariant.getComponents().get(0).getComponentItem().setStoryTitle("Changed Story Title");
        productVariantRepo.saveAndFlush(reloadedVariant);

        Orders snapshotCheck = ordersRepo.findById(created.getId()).orElseThrow();
        assertEquals(3, objectMapper.readTree(snapshotCheck.getOrderDetails().get(0).getSnapshotComponentsJson()).size());

        boxOrderService.cancelOrder(created.getId(), account.getId());
        assertEquals(0, componentItemRepo.findById(puzzleOne.getId()).orElseThrow().getReservedStock());

        Orders createdAgain = boxOrderService.createOrder(new BoxOrderService.CreateBoxOrderCommand(
            account.getId(),
            variant.getId(),
            1,
            null,
            "Ha Noi",
            "Hoan Kiem",
            "Hang Bac",
            "2 Tran Quang Khai",
            "2 Tran Quang Khai, Ha Noi",
            null,
            null,
            account.getId()
        ));
        Orders packed = boxOrderService.startPacking(createdAgain.getId(), account.getId());
        assertEquals(Orders.OrderStatus.PACKING, packed.getStatus());
        assertEquals(9, componentItemRepo.findById(pepperGhost.getId()).orElseThrow().getStockOnHand());
    }

    @Test
    void shouldRejectOrderWhenComponentStockIsInsufficient() {
        ComponentItem managedPuzzleOne = componentItemRepo.findById(puzzleOne.getId()).orElseThrow();
        ComponentItem managedPuzzleTwo = componentItemRepo.findById(puzzleTwo.getId()).orElseThrow();
        ComponentItem managedPepperGhost = componentItemRepo.findById(pepperGhost.getId()).orElseThrow();
        managedPuzzleOne.setStockOnHand(0);
        managedPuzzleTwo.setStockOnHand(0);
        managedPepperGhost.setStockOnHand(0);
        entityManager.flush();

        assertThrows(IllegalStateException.class, () -> boxOrderService.createOrder(new BoxOrderService.CreateBoxOrderCommand(
            account.getId(),
            variant.getId(),
            1,
            null,
            "Ha Noi",
            "Hoan Kiem",
            "Hang Bac",
            "3 Tran Quang Khai",
            "3 Tran Quang Khai, Ha Noi",
            null,
            null,
            account.getId()
        )));
    }

    @Test
    void shouldExposeStoryConfigThroughPublicEndpoint() throws Exception {
        mockMvc.perform(get("/api/public/puzzle-stories/video/Mb0RWyh3sqQ")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.storyTitle").value("Lac Long Quan"))
            .andExpect(jsonPath("$.data.qaList[0].question").value("Q1"));
    }

    @Test
    void shouldAcceptValidPuzzlePersistence() {
        assertDoesNotThrow(() -> {
            ComponentItem reloaded = componentItemRepo.findById(puzzleOne.getId()).orElseThrow();
            assertNotNull(reloaded.getStoryQaJson());
        });
    }
}
