package com.csse.server.service;
import com.csse.server.model.Order;
import com.csse.server.repository.OrderRepository;
import com.csse.server.states.*;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repo;

    public String changeOrderState(ObjectId orderId, String newState) {
        try {
            // Retrieve the order from the repository using the orderId.
            Optional<Order> optionalOrder = repo.findById(orderId);

            if (optionalOrder.isPresent()) {
                Order order = optionalOrder.get();

                // Change the order state based on the newState parameter.
                String statusMessage = changeState(order, newState);

                // Save the updated order back to MongoDB.
                repo.save(order);

                return statusMessage;
            } else {
                return null; // Return null for not found.
            }
        } catch (Exception e) {
            return "An error occurred.";
        }
    }

    public String changeState(Order order, String newState) {

        if ("pending".equalsIgnoreCase(newState)) {
            order.setState(new PendingState());
            return "Order state changed to Pending.";
        } else if ("approved".equalsIgnoreCase(newState)) {
            order.setState(new ApprovedState());
            return "Order state changed to Approved.";
        } else if ("declined".equalsIgnoreCase(newState)) {
            order.setState(new DeclinedState());
            return "Order state changed to Declined.";
        } else if ("placed".equalsIgnoreCase(newState)) {
            order.setState(new PlacedState());
            return "Order state changed to Placed.";
        } else if ("complete".equalsIgnoreCase(newState)) {
            order.setState(new CompleteState());
            return "Order state changed to Complete.";
        } else if ("processing".equalsIgnoreCase(newState)) {
            order.setState(new ProcessingState());
            return "Order state changed to Processing.";
        } else if ("delivering".equalsIgnoreCase(newState)) {
            order.setState(new DeliveringState());
            return "Order state changed to Delivering.";
        } else {
            return null; // Return null for an invalid state request.
        }
    }

    public OrderService() {
    }

    public List<Order> allOrders() {
        return repo.findAll();
    }

    public Optional<Order> singleOrder(ObjectId id) {
        return repo.findById(id);
    }

    public Order addOrder(Order payload) {
        return repo.insert(payload);
    }
}