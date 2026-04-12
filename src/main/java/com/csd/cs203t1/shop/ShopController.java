package com.csd.cs203t1.shop;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final ShopService shopService;
    private final UserService userService;

    public ShopController(ShopService shopService, UserService userService) {
        this.shopService = shopService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ShopDTO.ShopItemDTO>> getShopItems() {
        User user = userService.getCurrentUserReadOnly();
        return ResponseEntity.ok(shopService.getShopItems(user));
    }

    @PostMapping("/buy/{id}")
    public ResponseEntity<?> buyItem(@PathVariable Long id) {
        User user = userService.getCurrentUserReadOnly();
        try {
            ShopDTO.EquipResponse response = shopService.buyItem(user, id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
