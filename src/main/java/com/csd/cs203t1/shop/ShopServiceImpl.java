package com.csd.cs203t1.shop;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ShopServiceImpl implements ShopService {

    private final ItemRepository itemRepository;
    private final UserItemRepository userItemRepository;
    private final UserRepository userRepository;

    public ShopServiceImpl(ItemRepository itemRepository, UserItemRepository userItemRepository,
                           UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userItemRepository = userItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<ShopDTO.ShopItemDTO> getShopItems(User user) {
        List<Item> allItems = itemRepository.findAll();
        Set<Long> ownedItemIds = userItemRepository.findByUser(user).stream()
                .map(ui -> ui.getItem().getId())
                .collect(Collectors.toSet());

        return allItems.stream().map(item -> {
            String status;
            if (item.getId().equals(user.getEquippedOutfitId()) || item.getId().equals(user.getEquippedPetId())) {
                status = "equipped";
            } else if (ownedItemIds.contains(item.getId())) {
                status = "owned";
            } else {
                status = "locked";
            }
            return new ShopDTO.ShopItemDTO(item.getId(), item.getName(), item.getAssetId(),
                    item.getType().name(), item.getPrice(), status);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ShopDTO.EquipResponse buyItem(User user, Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        if (userItemRepository.existsByUserAndItem(user, item)) {
            throw new IllegalArgumentException("Item already owned");
        }
        if (user.getCoins() < item.getPrice()) {
            throw new IllegalArgumentException("Insufficient coins");
        }

        user.setCoins(user.getCoins() - item.getPrice());
        // Equip automatically after buying
        if (item.getType() == ItemType.OUTFIT) {
            user.setEquippedOutfitId(item.getId());
        } else if (item.getType() == ItemType.PET) {
            user.setEquippedPetId(item.getId());
        }
        userRepository.save(user);

        UserItem userItem = new UserItem();
        userItem.setUser(user);
        userItem.setItem(item);
        userItemRepository.save(userItem);

        return new ShopDTO.EquipResponse(user.getEquippedOutfitId(), user.getEquippedPetId());
    }

    @Override
    @Transactional
    public ShopDTO.EquipResponse equipItem(User user, Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        if (!userItemRepository.existsByUserAndItem(user, item)) {
            throw new IllegalArgumentException("Item not owned");
        }

        if (item.getType() == ItemType.OUTFIT) {
            user.setEquippedOutfitId(item.getId());
        } else if (item.getType() == ItemType.PET) {
            user.setEquippedPetId(item.getId());
        }
        userRepository.save(user);

        return new ShopDTO.EquipResponse(user.getEquippedOutfitId(), user.getEquippedPetId());
    }

    @Override
    @Transactional
    public ShopDTO.EquipResponse unequipSlot(User user, String slot) {
        if ("outfit".equalsIgnoreCase(slot)) {
            user.setEquippedOutfitId(null);
        } else if ("pet".equalsIgnoreCase(slot)) {
            user.setEquippedPetId(null);
        } else {
            throw new IllegalArgumentException("Unknown slot: " + slot);
        }
        userRepository.save(user);
        return new ShopDTO.EquipResponse(user.getEquippedOutfitId(), user.getEquippedPetId());
    }
}
