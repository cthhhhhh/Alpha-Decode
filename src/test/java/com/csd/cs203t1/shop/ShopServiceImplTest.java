package com.csd.cs203t1.shop;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ShopServiceImpl Unit Tests")
class ShopServiceImplTest {

    @Mock private ItemRepository itemRepository;
    @Mock private UserItemRepository userItemRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private ShopServiceImpl shopService;

    private User user;
    private Item outfitItem;
    private Item petItem;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setCoins(100);

        outfitItem = new Item();
        outfitItem.setId(10L);
        outfitItem.setName("Cool Hat");
        outfitItem.setPrice(50);
        outfitItem.setType(ItemType.OUTFIT);

        petItem = new Item();
        petItem.setId(11L);
        petItem.setName("Fluffy Dog");
        petItem.setPrice(150);
        petItem.setType(ItemType.PET);
    }

    @Test
    @DisplayName("buyItem: success for outfit")
    void buyItem_outfit_success() {
        when(itemRepository.findById(10L)).thenReturn(Optional.of(outfitItem));
        when(userItemRepository.existsByUserAndItem(user, outfitItem)).thenReturn(false);

        shopService.buyItem(user, 10L);

        assertEquals(50, user.getCoins());
        assertEquals(10L, user.getEquippedOutfitId());
        verify(userItemRepository).save(any(UserItem.class));
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("buyItem: success for pet")
    void buyItem_pet_success() {
        user.setCoins(200);
        when(itemRepository.findById(11L)).thenReturn(Optional.of(petItem));
        when(userItemRepository.existsByUserAndItem(user, petItem)).thenReturn(false);

        shopService.buyItem(user, 11L);

        assertEquals(50, user.getCoins());
        assertEquals(11L, user.getEquippedPetId());
        verify(userItemRepository).save(any(UserItem.class));
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("buyItem: throws if item already owned")
    void buyItem_alreadyOwned_throwsException() {
        when(itemRepository.findById(10L)).thenReturn(Optional.of(outfitItem));
        when(userItemRepository.existsByUserAndItem(user, outfitItem)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, 
            () -> shopService.buyItem(user, 10L));
        assertEquals("Item already owned", ex.getMessage());
    }

    @Test
    @DisplayName("buyItem: throws if insufficient coins")
    void buyItem_insufficientCoins_throwsException() {
        when(itemRepository.findById(11L)).thenReturn(Optional.of(petItem));
        when(userItemRepository.existsByUserAndItem(user, petItem)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, 
            () -> shopService.buyItem(user, 11L));
        assertEquals("Insufficient coins", ex.getMessage());
    }

    @Test
    @DisplayName("equipItem: success for outfit")
    void equipItem_outfit_success() {
        when(itemRepository.findById(10L)).thenReturn(Optional.of(outfitItem));
        when(userItemRepository.existsByUserAndItem(user, outfitItem)).thenReturn(true);

        shopService.equipItem(user, 10L);

        assertEquals(10L, user.getEquippedOutfitId());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("equipItem: success for pet")
    void equipItem_pet_success() {
        when(itemRepository.findById(11L)).thenReturn(Optional.of(petItem));
        when(userItemRepository.existsByUserAndItem(user, petItem)).thenReturn(true);

        shopService.equipItem(user, 11L);

        assertEquals(11L, user.getEquippedPetId());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("equipItem: throws if item not owned")
    void equipItem_notOwned_throwsException() {
        when(itemRepository.findById(10L)).thenReturn(Optional.of(outfitItem));
        when(userItemRepository.existsByUserAndItem(user, outfitItem)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, 
            () -> shopService.equipItem(user, 10L));
        assertEquals("Item not owned", ex.getMessage());
    }

    @Test
    @DisplayName("unequipSlot: success for outfit")
    void unequipSlot_outfit_success() {
        user.setEquippedOutfitId(10L);
        shopService.unequipSlot(user, "outfit");
        assertNull(user.getEquippedOutfitId());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("unequipSlot: success for pet")
    void unequipSlot_pet_success() {
        user.setEquippedPetId(11L);
        shopService.unequipSlot(user, "pet");
        assertNull(user.getEquippedPetId());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("unequipSlot: throws for unknown slot")
    void unequipSlot_unknown_throwsException() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, 
            () -> shopService.unequipSlot(user, "gloves"));
        assertTrue(ex.getMessage().contains("Unknown slot"));
    }

    @Test
    @DisplayName("getShopItems: returns items with correct status")
    void getShopItems_allStatuses() {
        Item lockedItem = new Item();
        lockedItem.setId(12L);
        lockedItem.setName("Locked Mask");
        lockedItem.setPrice(200);
        lockedItem.setType(ItemType.OUTFIT);

        user.setEquippedOutfitId(10L);
        user.setEquippedPetId(11L);

        when(itemRepository.findAll()).thenReturn(java.util.List.of(outfitItem, petItem, lockedItem));
        when(userItemRepository.findByUser(user)).thenReturn(java.util.List.of(
            new UserItem(1L, user, outfitItem),
            new UserItem(2L, user, petItem)
        ));

        java.util.List<ShopDTO.ShopItemDTO> items = shopService.getShopItems(user);

        assertEquals(3, items.size());
        assertEquals("equipped", items.get(0).getStatus()); // Outfit
        assertEquals("equipped", items.get(1).getStatus()); // Pet
        assertEquals("locked", items.get(2).getStatus());   // Locked
    }
}
