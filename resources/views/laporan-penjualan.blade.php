<table>
    <thead>
        <tr>
            <th>Tanggal Beli</th>
            <th>Kode Order</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Barang</th>
            <th>Quantity</th>
            <th>Total Harga</th>
        </tr>
    </thead>
    <tbody>
        @foreach($reportData as $data)
            <tr>
                <td>{{ $data['tanggal_beli'] }}</td>
                <td>{{ $data['order_code'] }}</td>
                <td>{{ $data['nama'] }}</td>
                <td>{{ $data['email'] }}</td>
                <td>{{ $data['barang'] }}</td>
                <td>{{ $data['quantity'] }}</td>
                <td>{{ number_format($data['total_harga'], 0, ',', '.') }}</td>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <td colspan="5"></td>
            <td><strong>Total</strong></td>
            <td><strong>{{ number_format(collect($reportData)->sum('total_harga'), 0, ',', '.') }}</strong></td>
        </tr>
    </tfoot>
</table>